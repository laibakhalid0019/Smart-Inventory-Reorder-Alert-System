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

    @OneToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;

    @OneToOne
    @JoinColumn(name = "stock_id", referencedColumnName = "id")
    private Stock stock;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "log_info")
    private MovementLog movementLog = MovementLog.ADD;

    public enum MovementLog {
        ADD,
        DELETE,
        UPDATE
    }
}
