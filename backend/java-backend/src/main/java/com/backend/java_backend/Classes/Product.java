package com.backend.java_backend.Classes;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;

    @Column(unique = true)
    private String sku;

    private String barcode;
    private double retail_price;
    private double cost_price;
    private int mst;
    private int quantity;
    private LocalDateTime expiry_date;

    @ManyToOne
    @JoinColumn(name = "distributor_id")
    private User distributor;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
