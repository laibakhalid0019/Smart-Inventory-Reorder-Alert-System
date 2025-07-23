package com.backend.java_backend.Controllers.Retailer;

import com.backend.java_backend.Classes.Request;
import com.backend.java_backend.DTOs.RequestProductDTO;
import com.backend.java_backend.Services.RequestService;
import jakarta.persistence.EntityNotFoundException;
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

    // View all requests
    @GetMapping("/view-request")
    public ResponseEntity<?> getRequests(@RequestParam(required = false) Request.Status status) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<Request> requestList;

            if (status != null) {
                requestList = requestService.findAllByRetailerIdAndStatus(username, status);
            } else {
                requestList = requestService.findAllByRetailerId(username);
            }

            if (requestList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No requests found.");
            }

            return ResponseEntity.ok(requestList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while retrieving requests.");
        }
    }


    // Generate new request
    @PostMapping("/generate-request")
    public ResponseEntity<?> generateRequest(@RequestBody RequestProductDTO requestProductDTO) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            Request request = requestService.generateRequest(username, requestProductDTO);

            return ResponseEntity.status(HttpStatus.CREATED).body(request);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while creating the request.");
        }
    }

    // Delete a request
    @DeleteMapping("/delete-request/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable("id") Long id) {
        try {
            boolean isDeleted = requestService.deleteRequest(id);

            if (isDeleted) {
                return ResponseEntity.ok("Request deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Approved request cannot be deleted.");
            }
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while deleting the request.");
        }
    }
    //export requests
    @GetMapping("/export-requests")
    public ResponseEntity<?> exportRequestsCSV() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<Request> requests = requestService.findAllByRetailerId(username);

            StringBuilder csvBuilder = new StringBuilder();
            csvBuilder.append("Request ID,Product,Distributor,Status,Created At\n");

            for (Request req : requests) {
                csvBuilder.append(req.getRequestId()).append(",")
                        .append(req.getProduct().getName()).append(",")
                        .append(req.getDistributor().getUsername()).append(",")
                        .append(req.getStatus()).append(",")
                        .append(req.getCreatedAt()).append("\n");
            }

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=request_report.csv")
                    .header("Content-Type", "text/csv")
                    .body(csvBuilder.toString().getBytes());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to export requests.");
        }
    }

}
