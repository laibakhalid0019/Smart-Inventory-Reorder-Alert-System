package com.backend.java_backend.Controllers.Retailer;
import com.backend.java_backend.Classes.Request;
import com.backend.java_backend.DTOs.RequestProductDTO;
import com.backend.java_backend.Services.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/retailer/request")
public class RetailerRequestController {

    @Autowired
    private RequestService requestService;
    private final String username = SecurityContextHolder.getContext().getAuthentication().getName();


    @PostMapping("/view-request")
    public ResponseEntity<?> getRequests(){
        List<Request> requestList = requestService.findAllByRetailerId(username);

        if(requestList.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Requests Not Found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(requestList);
    }

    @PostMapping("/generate-request")
    public ResponseEntity<?> generateRequest(@RequestBody RequestProductDTO  requestProductDTO){
       Request request = requestService.generateRequest(username, requestProductDTO);
       if(request == null){
           return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("Requests Not Found");
       }
       return ResponseEntity.status(HttpStatus.OK).body(requestProductDTO);
    }

    @PostMapping("/delete-request/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable("id") Long id){
        Boolean isDeleted = requestService.deleteRequest(id);
        if(isDeleted){
            return ResponseEntity.status(HttpStatus.OK).body("Request Deleted");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request that is approved cannot be deleted");
    }
}
