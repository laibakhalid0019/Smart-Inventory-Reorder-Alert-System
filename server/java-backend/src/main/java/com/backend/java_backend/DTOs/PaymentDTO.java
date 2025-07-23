package com.backend.java_backend.DTOs;
import com.backend.java_backend.Classes.Payment.Status;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    private float amount;
    private String currency;
}
