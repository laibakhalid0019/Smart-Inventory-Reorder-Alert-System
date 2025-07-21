package com.backend.java_backend.Controllers.Retailer;


import com.backend.java_backend.Classes.Order;
import com.backend.java_backend.DTOs.OrderDTO;
import com.backend.java_backend.Services.OrderService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/retailer/order")
public class RetailerOrderController {

    @Autowired
    private OrderService orderService;
    String username =  SecurityContextHolder.getContext().getAuthentication().getName();
    //get all orders
    @GetMapping("/view-orders")
    public ResponseEntity<?> viewOrders() {
        List<Order> orders = orderService.findAllByRetailerId(username);
        if(orders.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found");
        }
        return  ResponseEntity.status(HttpStatus.OK).body(orders);
    }

    //view orders on status
    @GetMapping("/view-order-status")
    public ResponseEntity<?> viewOrderStatus(@RequestParam Order.Status status) {
        List<Order> orders = orderService.findAllByStatus(status,username);
        if(orders.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found");
        }
        return  ResponseEntity.status(HttpStatus.OK).body(orders);
    }

    @PostMapping("/generate-order-invoice")
    public ResponseEntity<?> generateOrderInvoice(@RequestBody OrderDTO orderDTO) {
        try {
            orderService.createOrder(orderDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(orderDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong while creating the order.");
        }
    }
}
