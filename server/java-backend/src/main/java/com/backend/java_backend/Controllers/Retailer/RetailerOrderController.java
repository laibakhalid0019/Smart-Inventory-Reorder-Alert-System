package com.backend.java_backend.Controllers.Retailer;

import com.backend.java_backend.Classes.Order;
import com.backend.java_backend.DTOs.PaymentDTO;
import com.backend.java_backend.Repos.OrderRepo;
import com.backend.java_backend.Services.OrderService;
import com.backend.java_backend.Services.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static com.backend.java_backend.Controllers.Distributor.DistributorOrderController.getResponseEntity;

@RestController
@RequestMapping("/retailer/order")
public class RetailerOrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderRepo orderRepo;

    // Get all orders
    @GetMapping("/view-orders")
    public ResponseEntity<?> viewOrders() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<Order> orders = orderService.findAllByRetailerId(username);
            if (orders.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found");
            }
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve orders.");
        }
    }

    // Get orders by status
    @GetMapping("/view-order-status")
    public ResponseEntity<?> viewOrderStatus(@RequestParam Order.Status status) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<Order> orders = orderService.findAllByStatus(status, username);
            if (orders.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found");
            }
            return ResponseEntity.ok(orders);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid order status provided.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while fetching orders by status.");
        }
    }
    // Handle payment
    @PostMapping("/payment/{id}")
    public ResponseEntity<?> paymentOrder(@PathVariable Long id, @RequestBody PaymentDTO paymentDTO) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            PaymentIntent paymentIntent = paymentService.chargeAmount(id, username, paymentDTO.getAmount(), paymentDTO.getCurrency());

            if (paymentIntent == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment could not be processed.");
            }
            orderRepo.findByOrderId(id).setStatus(Order.Status.PAID);
            return ResponseEntity.ok(Map.of("client_secret", paymentIntent.getClientSecret()));

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Stripe error: " + e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong while processing the strip payment.");
        }
    }
    //export orders
    @GetMapping("/export-orders")
    public ResponseEntity<?> exportOrdersCSV() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<Order> orders = orderService.findAllByRetailerId(username);

            return getResponseEntity(orders);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to export orders.");
        }
    }

}
