package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.Logs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogsRepo extends JpaRepository<Logs, Long> {
    List<Logs> findByStockId(Long stockId);
    // You can add custom query methods here if needed
}
