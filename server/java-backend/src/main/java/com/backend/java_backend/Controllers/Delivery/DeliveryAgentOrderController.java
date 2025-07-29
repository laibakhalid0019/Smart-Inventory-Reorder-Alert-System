package com.backend.java_backend.Controllers.Delivery;

import com.backend.java_backend.Classes.Order;
import com.backend.java_backend.Services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/delivery/order")
public class DeliveryAgentOrderController {

    @Autowired
    private OrderService orderService;
    @GetMapping("/get-info")
    public ResponseEntity<?> getInfo(){
        return ResponseEntity.status(HttpStatus.OK).body("DELIVERY AGENT");
    }

    @GetMapping("/view-orders")
    public ResponseEntity<?> viewOrders(){
        String username =  SecurityContextHolder.getContext().getAuthentication().getName();
        List<Order> orderList = orderService.findAllByDeliveryAgent(username);
        if(orderList.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Orders not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(orderList);
    }

    @PostMapping("/change-order-status/{id}")
    public ResponseEntity<?> changeOrderStatus(@RequestParam String status, @PathVariable Long id){
        String username =  SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            String message = orderService.updateOrderStatus(id, status, username);
            return ResponseEntity.status(HttpStatus.OK).body(message);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (SecurityException se) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(se.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + ex.getMessage());
        }
    }
}
