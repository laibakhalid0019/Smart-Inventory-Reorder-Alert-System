package com.backend.java_backend.Services;

import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.Classes.Request;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.DTOs.RequestProductDTO;
import com.backend.java_backend.Repos.ProductRepo;
import com.backend.java_backend.Repos.RequestRepo;
import com.backend.java_backend.Repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RequestService {


    @Autowired
    private RequestRepo requestRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ProductRepo productRepo;

    public List<Request> findByStatus(Request.Status status){
        return requestRepo.findAllByStatus(status);
    }

    public List<Request> findAllByRetailerId(String username){
        User user = userRepo.findByUsername(username);
        return requestRepo.findAllByRetailer_Id(user.getId());
    }

    public Boolean deleteByRequestId(Long id){
        return requestRepo.deleteRequestByRequestId(id);
    }

    public Request generateRequest(String username, RequestProductDTO requestProductDTO){
        User user = userRepo.findByUsername(username);

        Request request =  new Request();
        request.setRetailer(user);
        request.setDistributor(userRepo.findById(requestProductDTO.getDistributorId()));
        request.setProduct(productRepo.findById(requestProductDTO.getProductId()));
        request.setQuantity(requestProductDTO.getQuantity());
        return requestRepo.save(request);
    }

    public Boolean deleteRequest(Long id){
        Request request = requestRepo.findByRequestId(id);
        if(request.getStatus() == Request.Status.PENDING || request.getStatus() == Request.Status.REJECTED){
            requestRepo.deleteRequestByRequestId(id);
            return true;
        }
        return false;
    }

    public List<Request> findAllByRetailerIdAndStatus(String username, Request.Status status) {
        User user = userRepo.findByUsername(username);
        return requestRepo.findAllByRetailer_IdAndStatus(user.getId(), status);
    }

    public void updateRequestStatus(String status, Long id) {
        Request request = requestRepo.findByRequestId(id);
        //find product quantity
        Product product = productRepo.findById(request.getProduct().getId());
        //match quantity of distributor
        if(product.getQuantity() < request.getQuantity()){
            throw new IllegalArgumentException("Product quantity less than request quantity");
        }
        try {
            Request.Status newStatus = Request.Status.valueOf(status.toUpperCase());
            request.setStatus(newStatus);
            requestRepo.save(request);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + status);
        }
    }

    public List<Request> findAllByDistributor_Id(String username) {
        User distributor = userRepo.findByUsername(username);
        return requestRepo.findAllByDistributor_Id(distributor.getId());
    }

}
