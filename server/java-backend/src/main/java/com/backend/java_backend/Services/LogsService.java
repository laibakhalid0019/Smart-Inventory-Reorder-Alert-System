package com.backend.java_backend.Services;

import com.backend.java_backend.Classes.Logs;
import com.backend.java_backend.Classes.Stock;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.Repos.LogsRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogsService {

    @Autowired
    private final LogsRepo logsRepo;

    public LogsService(LogsRepo logsRepo) {
        this.logsRepo = logsRepo;
    }

    public void createLog(Stock stock, User user, Logs.MovementLog action) {
        Logs log = new Logs();
        log.setStock(stock);
        log.setProduct(stock.getProduct());
        log.setUser(user);
        log.setMovementLog(action);
        log.setQuantity(stock.getQuantity());
        logsRepo.save(log);
    }

    public void saveLog(Logs log) {
        logsRepo.save(log);
    }

    /**
     * Updates all logs that reference a specific stock to remove the reference
     * but preserve the product and quantity information
     */
    @Transactional
    public void nullifyStockReferences(Long stockId) {

    }
}
