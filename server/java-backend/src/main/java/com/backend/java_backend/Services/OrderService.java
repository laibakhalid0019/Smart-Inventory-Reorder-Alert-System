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

//    public void createOrder(OrderDTO orderDTO){
//        Request request = requestRepo.findById(orderDTO.getRequestId())
//                .orElseThrow(() -> new EntityNotFoundException("Request not found with ID: " + orderDTO.getRequestId()));
//
//        if (!request.getStatus().equals(Request.Status.ACCEPTED)) {
//            throw new IllegalArgumentException("Order cannot be created unless the request is accepted.");
//        }
//
//        // Check if order already exists for this request
//        if (orderRepo.existsByRequest(request)) {
//            throw new IllegalArgumentException("Order already exists for this request.");
//        }
//
//        // Build Order entity
//        Order order = new Order();
//        order.setRequest(request);
//        order.setOrderNumber(UUID.randomUUID().toString().substring(0, 10).toUpperCase());
//        User user = userRepo.findById(order.getRetailer().getId());
//        if(user == null){
//            throw new IllegalArgumentException("User not found with ID: " + order.getRetailer().getId());
//        }
//        order.setRetailer(user);
//        Product product = productRepo.findById(order.getProduct().getId());
//        if(product == null){
//            throw new IllegalArgumentException("Product not found with ID: " + order.getProduct().getId());
//        }
//        order.setProduct(product);
//        User user1 = userRepo.findById(order.getRetailer().getId());
//        if(user1 == null){
//            throw new IllegalArgumentException("User not found with ID: " + order.getRetailer().getId());
//        }
//        order.setDistributor(user1);
//        order.setQuantity(orderDTO.getQuantity());
//        orderRepo.save(order);
//    }

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


}
