package com.backend.java_backend.Controllers.Distributor;

import com.backend.java_backend.Classes.Order;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.DTOs.DeliveryAgentDTO;
import com.backend.java_backend.Services.CustomUserDetailsService;
import com.backend.java_backend.Services.OrderService;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/distributor/order")
public class DistributorOrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @GetMapping("/get-distributors")
    public ResponseEntity<?> getDistributors(){
        List<User> distributorsList = userDetailsService.getAllDistributors();

        if(distributorsList.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No distributors found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(distributorsList);
    }

    @PostMapping("/generate-order/{id}")
    public ResponseEntity<?> generateOrder(@RequestBody DeliveryAgentDTO deliveryAgentDTO, @PathVariable Long id) {
        if (deliveryAgentDTO == null || deliveryAgentDTO.getDeliveryAgent() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Delivery agent is required");
        }

        Order order = orderService.autoCreateOrderFromRequest(id, deliveryAgentDTO.getDeliveryAgent());
        if(order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not generated");
        }
        return ResponseEntity.status(HttpStatus.OK).body(order);
    }

    @GetMapping("/view-orders")
    public ResponseEntity<?> viewOrders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Order> orderList = orderService.findByDistributor(username);
        if(orderList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Orders not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(orderList);
    }

    @GetMapping("/export-orders")
    public ResponseEntity<?> exportOrdersCSV() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<Order> orders = orderService.findByDistributor(username);

            return getResponseEntity(orders);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to export orders.");
        }
}

    @NotNull
    public static ResponseEntity<?> getResponseEntity(List<Order> orders) {
        StringBuilder csvBuilder = new StringBuilder();
        csvBuilder.append("Order ID,Product,Status,Order Number,Created At\n");

        for (Order order : orders) {
            csvBuilder.append(order.getOrderId()).append(",")
                    .append(order.getProduct().getName()).append(",")
                    .append(order.getStatus()).append(",")
                    .append(order.getOrderNumber()).append(",")
                    .append(order.getPaymentTimestamp()).append("\n");
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=order_report.csv")
                .header("Content-Type", "text/csv")
                .body(csvBuilder.toString().getBytes());
    }
    }
