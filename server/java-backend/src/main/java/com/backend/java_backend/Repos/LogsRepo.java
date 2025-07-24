package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.Logs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogsRepo extends JpaRepository<Logs, Long> {
    // You can add custom query methods here if needed
}
