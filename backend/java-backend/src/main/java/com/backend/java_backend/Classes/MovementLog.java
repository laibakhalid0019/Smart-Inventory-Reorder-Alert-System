package com.backend.java_backend.Classes;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Entity
@Table(name = "movement_logs")
@Data
public class MovementLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "action_type")
    private String actionType; // SALE, SUPPLY, ADD, UPDATE

    private Integer quantity;

    private String details;

    @Column(name = "logged_at")
    private LocalDateTime loggedAt = LocalDateTime.now();

}
