package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.Order;
import com.backend.java_backend.Classes.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order,Long> {

    List<Order> findAllByRetailer_Id(Long id);
    List<Order> findAllByStatusAndRetailerId(Order.Status status, Long retailer_id);
    boolean existsByRequest(Request request);
    Order findByOrderId(Long id);
}
