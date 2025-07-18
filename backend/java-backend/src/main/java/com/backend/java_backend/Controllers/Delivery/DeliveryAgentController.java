package com.backend.java_backend.Controllers.Delivery;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/delivery")
public class DeliveryAgentController {
    @GetMapping("/get-info")
    public ResponseEntity<?> getInfo(){
        return ResponseEntity.status(HttpStatus.OK).body("DELIVERY AGENT");
    }
}
