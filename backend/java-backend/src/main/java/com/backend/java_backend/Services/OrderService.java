package com.backend.java_backend.Services;

import com.backend.java_backend.Classes.Order;
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

    public void createOrder(OrderDTO orderDTO){
        Request request = requestRepo.findById(orderDTO.getRequestId())
                .orElseThrow(() -> new EntityNotFoundException("Request not found with ID: " + orderDTO.getRequestId()));

        if (!request.getStatus().equals(Request.Status.ACCEPTED)) {
            throw new IllegalArgumentException("Order cannot be created unless the request is accepted.");
        }

        // Check if order already exists for this request
        if (orderRepo.existsByRequest(request)) {
            throw new IllegalArgumentException("Order already exists for this request.");
        }

        // Build Order entity
        Order order = new Order();
        order.setRequest(request);
        order.setOrderNumber(UUID.randomUUID().toString().substring(0, 10).toUpperCase());
        order.setRetailer(userRepo.findById(orderDTO.getRetailerId())
                .orElseThrow(() -> new EntityNotFoundException("Retailer not found.")));
        order.setDistributor(userRepo.findById(orderDTO.getDistributorId())
                .orElseThrow(() -> new EntityNotFoundException("Distributor not found.")));
        order.setProduct(productRepo.findById(orderDTO.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found.")));
        order.setQuantity(orderDTO.getQuantity());
        orderRepo.save(order);
    }
}
