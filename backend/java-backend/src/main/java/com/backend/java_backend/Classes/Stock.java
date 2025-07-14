package com.backend.java_backend.Classes;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "stocks")
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String batch;
    private Date batchExpiry;
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
