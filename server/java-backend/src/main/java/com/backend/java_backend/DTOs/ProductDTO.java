package com.backend.java_backend.DTOs;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String category;
    private String sku;
    private String barcode;
    private double retail_price;
    private double cost_price;
    private int mst;
    private int quantity;
    private LocalDateTime expiry_date;
    private String imageUrl;

    private Long distributorId;

    private LocalDateTime createdAt;
}
