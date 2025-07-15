package com.backend.java_backend.Classes;


import jakarta.persistence.*;

@Entity
@Table(name = "retailerDistributor")
public class RetailerDistributor {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "retailer_id")
    private User retailer;

    @ManyToOne
    @JoinColumn(name = "distributor_id")
    private User distributor;
}
