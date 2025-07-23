package com.backend.java_backend.DTOs;

import lombok.Data;

@Data
public class RequestProductDTO {
    private Long distributorId;
    private Long productId;
    private Integer quantity;
}
