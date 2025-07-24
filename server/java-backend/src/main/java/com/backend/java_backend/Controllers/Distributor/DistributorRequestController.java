package com.backend.java_backend.Controllers.Distributor;

import com.backend.java_backend.Classes.Request;
import com.backend.java_backend.Services.RequestService;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/distributor/request")
public class DistributorRequestController {

    @Autowired
    private RequestService requestService;
    @PostMapping("/change-status/{id}")
    public ResponseEntity<?> changeStatus(@RequestParam String status, @PathVariable Long id) {
        try {
            requestService.updateRequestStatus(status, id);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Status changed successfully");
        } catch (IllegalArgumentException e) {
            // For invalid status or request not found
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // For unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the request status.");
        }
    }

    @GetMapping("/view-requests")
    public ResponseEntity<?> viewRequests() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Request> requestList = requestService.findAllByDistributor_Id(username);
        if(requestList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No requests found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(requestList);
    }

    @DeleteMapping("/delete-requests/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        Boolean isDeleted =  requestService.deleteRequest(id);
        if(!isDeleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Request Deleted successfully");
    }

    @GetMapping("/export-requests")
    public ResponseEntity<?> exportRequestsCSV() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<Request> requests = requestService.findAllByDistributor_Id(username);

            return getResponseEntity(requests);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to export requests.");
        }
    }

    @NotNull
    public static ResponseEntity<?> getResponseEntity(List<Request> requests) {
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
    }
}
