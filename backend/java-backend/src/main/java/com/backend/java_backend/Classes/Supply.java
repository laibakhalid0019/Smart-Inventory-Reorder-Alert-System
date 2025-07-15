package com.backend.java_backend.Classes;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "supplies")
public class Supply {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "distributor_id")
    private User distributor;

    @ManyToOne @JoinColumn(name = "retailer_id")
    private User retailer;

    @ManyToOne @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne @JoinColumn(name = "batch_id")
    private Batch batch;

    private Integer quantity;

    @Column(name = "supplied_at")
    private LocalDateTime suppliedAt = LocalDateTime.now();
}
