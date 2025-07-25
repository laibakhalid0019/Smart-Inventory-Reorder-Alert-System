package com.backend.java_backend.Services;

import com.backend.java_backend.Classes.Order;
import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.Classes.Request;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.DTOs.OrderDTO;
import com.backend.java_backend.Repos.OrderRepo;
import com.backend.java_backend.Repos.ProductRepo;
import com.backend.java_backend.Repos.RequestRepo;
import com.backend.java_backend.Repos.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private RequestRepo requestRepo;
    @Autowired
    private ProductRepo productRepo;

    public List<Order> findAllByRetailerId(String username){
        User user = userRepo.findByUsername(username);
        return  orderRepo.findAllByRetailer_Id(user.getId());
    }

    public List<Order> findAllByStatus(Order.Status status,String username){
        User user = userRepo.findByUsername(username);
        return orderRepo.findAllByStatusAndRetailerId(status,user.getId());
    }

    public List<Order> findAllByDeliveryAgent(String username){
        User user = userRepo.findByUsername(username);
        return orderRepo.findAllByDeliveryAgent_Id(user.getId());
    }

    public Order autoCreateOrderFromRequest(Long id, String deliveryAgent) {
        Request request = requestRepo.findByRequestId(id);
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be found.");
        }

        if (deliveryAgent == null || deliveryAgent.isBlank()) {
            throw new IllegalArgumentException("Delivery agent username is required.");
        }

        User agent = userRepo.findByUsername(deliveryAgent);
        if (agent == null) {
            throw new IllegalArgumentException("Delivery agent not found: " + deliveryAgent);
        }

        if (request.getRetailer() == null || request.getDistributor() == null || request.getProduct() == null) {
            throw new IllegalStateException("Request is missing required associations (retailer, distributor, product).");
        }

        try {
            Order order = new Order();
            order.setRequest(request);
            order.setRetailer(request.getRetailer());
            order.setDistributor(request.getDistributor());
            order.setProduct(request.getProduct());
            order.setQuantity(request.getQuantity());
            order.setOrderNumber(UUID.randomUUID().toString().substring(0, 8));
            order.setStatus(Order.Status.PENDING);
            order.setDeliveryAgent(agent);

           return orderRepo.save(order);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order from request: " + e.getMessage(), e);
        }
    }

    public List<Order> findByDistributor(String username){
        User distributor = userRepo.findByUsername(username);
        return orderRepo.findAllByDistributor_Id(distributor.getId());
    }

    public String updateOrderStatus(Long orderId, String status, String username) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        User currentUser = userRepo.findByUsername(username);

        if (order.getDeliveryAgent() == null || !order.getDeliveryAgent().getId().equals(currentUser.getId())) {
            throw new SecurityException("You are not assigned to this order.");
        }

        Order.Status newStatus;
        try {
            newStatus = Order.Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + status);
        }

        if (order.getStatus() == Order.Status.DELIVERED) {
            throw new IllegalStateException("Order already delivered. Status cannot be changed.");
        }

        if (order.getStatus() == newStatus) {
            throw new IllegalStateException("Order already in " + newStatus + " status.");
        }

        // Set timestamps if needed
        if (newStatus == Order.Status.DISPATCHED) {
            order.setDispatchedAt(new Timestamp(System.currentTimeMillis()));
        } else if (newStatus == Order.Status.DELIVERED) {
            order.setDeliveredAt(new Timestamp(System.currentTimeMillis()));
        }

        order.setStatus(newStatus);
        orderRepo.save(order);

        return "Order status updated to " + newStatus;
    }


}
