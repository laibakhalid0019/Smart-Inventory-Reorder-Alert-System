package com.backend.java_backend.Classes;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
@Data
public class Request {



    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long requestId;

    @ManyToOne
    @JoinColumn(name = "retailer_id")
    private User retailer;

    @ManyToOne
    @JoinColumn(name = "distributor_id")
    private User distributor;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    private float price;

    @Column(name = "order-check")
    private boolean orderCheck;


    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "request_status")
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;
    public enum Status {
        PENDING,
        REJECTED,
        ACCEPTED
    }
}