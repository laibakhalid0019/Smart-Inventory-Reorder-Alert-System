package com.backend.java_backend.Classes;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "stock_id")
    private Stock stock;

    @Column(name = "alert_type")
    private String alertType; // LOW_STOCK, NEAR_EXPIRY

    private String message;

    private Boolean resolved = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
