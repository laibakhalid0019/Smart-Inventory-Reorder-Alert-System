package com.backend.java_backend.Classes;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    private String gateway;
    @Column(unique = true)
    private String transactionId;

    private BigDecimal amount;

    private String currency = "PKR";

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private String paymentMethod;

    private Timestamp paidAt;

    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    public enum Status {
        PENDING,
        SUCCESS,
        FAILED,
        REFUNDED
    }
}
