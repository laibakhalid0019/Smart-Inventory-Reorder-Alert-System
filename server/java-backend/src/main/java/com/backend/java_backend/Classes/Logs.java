package com.backend.java_backend.Classes;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "logs")
public class Logs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", unique = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "stock_id", nullable = true)
    private Stock stock;

    @ManyToOne
    @JoinColumn(name = "user_id", unique = false)
    private User user;

    // Add quantity to store this information even if stock is deleted
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "log_info")
    private MovementLog movementLog = MovementLog.ADD;

    public enum MovementLog {
        ADD,
        DELETE,
        UPDATE
    }
}
