package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long> {
    List<Payment> findAllByUserId(Long id);
}
