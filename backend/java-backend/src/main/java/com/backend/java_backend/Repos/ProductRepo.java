package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepo extends JpaRepository<Product,Integer> {
    //delete a product by SKU
    Boolean deleteProductBySku(String sku);
    //delete a product by ID
    Boolean deleteProductById(long id);
    //get all products
    List<Product> findAllByName(String username);
    Product findById(long id);
    Product findBySku(String sku);

    List<Product> findAllByCategory(String category);
}
