package com.backend.java_backend.DTOs;

import lombok.Data;

@Data
public class RequestProductDTO {
    private long distributorId;
    private long productId;
    private Integer quantity;
    private float price;
}
