package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductRepo extends JpaRepository<Product, Long> {
    //delete a product by SKU
    @Transactional
    @Modifying
    int deleteProductBySku(String sku);

    //delete a product by ID
    @Transactional
    @Modifying
    int deleteProductById(long id);

    //get all products
    List<Product> findAllByName(String username);
    Product findById(long id);
    Product findBySku(String sku);

    List<Product> findAllByCategory(String category);

    List<Product> findAllByDistributor_Id(Long id);
}
