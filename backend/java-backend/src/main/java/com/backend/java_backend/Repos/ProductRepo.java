package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface ProductRepo extends JpaRepository<Product,Integer> {

}
