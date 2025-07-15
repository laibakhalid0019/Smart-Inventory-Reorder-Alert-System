package com.backend.java_backend.Classes;

import jakarta.persistence.Entity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
public class Sale {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "retailer_id")
    private User retailer;

    @ManyToOne @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    @Column(name = "sale_price")
    private BigDecimal salePrice;

    @Column(name = "sold_at")
    private LocalDateTime soldAt = LocalDateTime.now();
}
