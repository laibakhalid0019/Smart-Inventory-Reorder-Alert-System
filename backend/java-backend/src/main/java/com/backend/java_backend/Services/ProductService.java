package com.backend.java_backend.Services;

import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.Repos.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
@Service
public class ProductService {
    @Autowired
    private  ProductRepo productRepo;

    public List<Product> findAll(String username){
        return productRepo.findAllByName(username);
    }

    public Boolean deleteProductById(long id){
        return productRepo.deleteProductById(id);
    }

    public Boolean deleteProductBySku(String sku){
        return productRepo.deleteProductBySku(sku);
    }

}
