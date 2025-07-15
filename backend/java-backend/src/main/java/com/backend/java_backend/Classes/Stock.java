package com.backend.java_backend.Classes;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"product_id", "user_id"})
})
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne @JoinColumn(name = "user_id")
    private User owner; // Retailer or Distributor

    @ManyToOne @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(name = "cost_price")
    private BigDecimal costPrice;

    @Column(name = "retail_price")
    private BigDecimal retailPrice;

    private Integer quantity;
    private Integer minThreshold;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated = LocalDateTime.now();
}
