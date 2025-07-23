package com.backend.java_backend.DTOs;

import com.backend.java_backend.Classes.Order.Status;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private String orderNumber;

    private Long requestId;

    private Long retailerId;
    private String retailerName;

    private Long distributorId;
    private String distributorName;

    private Long productId;
    private String productName;

    private Integer quantity;

    private Status status;

    private LocalDateTime paymentTimestamp;
    private LocalDateTime dispatchedAt;
    private LocalDateTime deliveredAt;

    private Long deliveryAgentId;
    private String deliveryAgentName;
}
