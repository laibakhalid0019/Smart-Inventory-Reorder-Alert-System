package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.MovementLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovementLogsRepo extends JpaRepository<MovementLog, Long> {
    List<MovementLog> findByProductId(Long productId);
}
