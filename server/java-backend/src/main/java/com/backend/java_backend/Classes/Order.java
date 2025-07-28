package com.backend.java_backend.Classes;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @OneToOne
    @JoinColumn(name = "request_id")
    private Request request;

    @Column(unique = true)
    private String orderNumber;

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

    @Column(name = "order_status")
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;
    public enum Status {
        PENDING,
        PAID,
        DISPATCHED,
        DELIVERED
    }
    private Timestamp paymentTimestamp;

    @ManyToOne
    @JoinColumn(name = "delivery_agent_id")
    private User deliveryAgent;

    private Timestamp dispatchedAt;

    private Timestamp deliveredAt;
}
