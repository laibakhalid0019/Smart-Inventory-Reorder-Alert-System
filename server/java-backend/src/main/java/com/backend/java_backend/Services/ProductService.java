package com.backend.java_backend.Services;

import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.DTOs.ProductDTO;
import com.backend.java_backend.Repos.ProductRepo;
import com.backend.java_backend.Repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
@Service
public class ProductService {
    @Autowired
    private  ProductRepo productRepo;
    @Autowired
    private UserRepo userRepo;

    public List<Product> findAll(String username){
        return productRepo.findAllByName(username);
    }

    public Boolean deleteProductById(long id){
        return productRepo.deleteProductById(id);
    }

    public Boolean deleteProductBySku(String sku){
        return productRepo.deleteProductBySku(sku);
    }

    public List<Product> findByCategory(String category){
        return productRepo.findAllByCategory(category);
    }

    public Product addProduct(ProductDTO productDTO,String username,String url){
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

    public Product updateProduct(Long id, ProductDTO productDTO, String username) {
        Product existingProduct = productRepo.findById(id);

        // Check if product exists and belongs to the current user
        if(existingProduct == null || !existingProduct.getDistributor().getUsername().equals(username)) {
            return null;
        }

        // Only update fields that are provided (not null)
        if(productDTO.getName() != null) {
            existingProduct.setName(productDTO.getName());
        }

        if(productDTO.getCategory() != null) {
            existingProduct.setCategory(productDTO.getCategory());
        }

        if(productDTO.getSku() != null) {
            existingProduct.setSku(productDTO.getSku());
        }

        if(productDTO.getBarcode() != null) {
            existingProduct.setBarcode(productDTO.getBarcode());
        }

        if(productDTO.getRetail_price() != 0) {
            existingProduct.setRetail_price(productDTO.getRetail_price());
        }

        if(productDTO.getCost_price() != 0) {
            existingProduct.setCost_price(productDTO.getCost_price());
        }

        if(productDTO.getMst() != 0) {
            existingProduct.setMst(productDTO.getMst());
        }

        if(productDTO.getQuantity() != 0) {
            existingProduct.setQuantity(productDTO.getQuantity());
        }

        if(productDTO.getExpiry_date() != null) {
            existingProduct.setExpiry_date(productDTO.getExpiry_date());
        }

        return productRepo.save(existingProduct);
    }
}
