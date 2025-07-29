package com.backend.java_backend.Services;
import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.DTOs.ProductDTO;
import com.backend.java_backend.Repos.ProductRepo;
import com.backend.java_backend.Repos.RequestRepo;
import com.backend.java_backend.Repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {
    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RequestRepo requestRepo;

    public List<Product> findAll(String username) {
        User user = userRepo.findByUsername(username);
        return productRepo.findAllByDistributor_Id(user.getId());
    }

    public Map<String, Object> deleteProductById(long id) {
        Map<String, Object> result = new HashMap<>();

        // First, check if the product has any associated requests
        if (requestRepo.existsByProduct_Id(id)) {
            result.put("success", false);
            result.put("message", "Cannot delete this product because it is associated with one or more requests");
            return result;
        }

        // If no associated requests, proceed with deletion
        int deleted = productRepo.deleteProductById(id);
        boolean success = deleted > 0;

        result.put("success", success);
        result.put("message", success ? "The product was deleted successfully" : "Product not found");

        return result;
    }

    public Map<String, Object> deleteProductBySku(String sku) {
        Map<String, Object> result = new HashMap<>();

        // Find the product by SKU to get its ID
        Product product = productRepo.findBySku(sku);
        if (product == null) {
            result.put("success", false);
            result.put("message", "Product not found");
            return result;
        }

        // Check if the product has any associated requests
        if (requestRepo.existsByProduct_Id(product.getId())) {
            result.put("success", false);
            result.put("message", "Cannot delete this product because it is associated with one or more requests");
            return result;
        }

        // If no associated requests, proceed with deletion
        int deleted = productRepo.deleteProductBySku(sku);
        boolean success = deleted > 0;

        result.put("success", success);
        result.put("message", success ? "The product was deleted successfully" : "Product not found");

        return result;
    }

    public List<Product> findByCategory(String category) {
        return productRepo.findAllByCategory(category);
    }

    public Product addProduct(ProductDTO productDTO, String username, String url) {
        User distributor = userRepo.findByUsername(username);
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setCategory(productDTO.getCategory());
        product.setSku(productDTO.getSku());
        product.setBarcode(productDTO.getBarcode());
        product.setRetail_price(productDTO.getRetail_price());
        product.setCost_price(productDTO.getCost_price());
        product.setMst(productDTO.getMst());
        product.setQuantity(productDTO.getQuantity());
        product.setExpiry_date(productDTO.getExpiry_date());
        product.setImageUrl(url);
        product.setDistributor(distributor);
        product.setCreatedAt(LocalDateTime.now());

        return productRepo.save(product);
    }

    public Product updateProduct(long id, ProductDTO productDTO, String username) {
        Product existingProduct = productRepo.findById(id);

        // Check if product exists and belongs to the current user
        if (existingProduct == null || !existingProduct.getDistributor().getUsername().equals(username)) {
            return null;
        }

        // Check if product is part of any requests
        boolean isInRequests = requestRepo.existsByProduct_Id(id);

        // Fields that can always be updated regardless of request status
        if (productDTO.getName() != null) {
            existingProduct.setName(productDTO.getName());
        }

        if (productDTO.getCategory() != null) {
            existingProduct.setCategory(productDTO.getCategory());
        }

        if (productDTO.getBarcode() != null) {
            existingProduct.setBarcode(productDTO.getBarcode());
        }

        // Fix the imageUrl field name (changed from getImageurl to getImageUrl)
        if(productDTO.getImageurl() != null) {
            existingProduct.setImageUrl(productDTO.getImageurl());
        }

        // Critical fields that should be restricted if product is in requests
        if (!isInRequests) {
            // These fields can only be updated if the product is not in any active requests
            if (productDTO.getSku() != null) {
                existingProduct.setSku(productDTO.getSku());
            }

            if (productDTO.getRetail_price() != 0) {
                existingProduct.setRetail_price(productDTO.getRetail_price());
            }

            if (productDTO.getCost_price() != 0) {
                existingProduct.setCost_price(productDTO.getCost_price());
            }

            if (productDTO.getMst() != 0) {
                existingProduct.setMst(productDTO.getMst());
            }

            if (productDTO.getExpiry_date() != null) {
                existingProduct.setExpiry_date(productDTO.getExpiry_date());
            }
        }

        // Quantity can be updated but might need special logic
        // For example, ensure quantity doesn't go below what's already requested
        if (productDTO.getQuantity() != 0) {
            // You might want to implement additional checks here
            existingProduct.setQuantity(productDTO.getQuantity());
        }

        return productRepo.save(existingProduct);
    }
}
