package com.backend.java_backend.DTOs;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.cglib.core.Local;

import java.sql.Date;
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
    private String imageurl;
    private int quantity;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiry_date;

    private Long distributorId;

    private LocalDateTime createdAt;
}
