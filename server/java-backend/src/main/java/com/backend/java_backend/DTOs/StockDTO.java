package com.backend.java_backend.DTOs;

import lombok.Data;

@Data
public class StockDTO {
    private int quantity;
    private int min_threshold;
}