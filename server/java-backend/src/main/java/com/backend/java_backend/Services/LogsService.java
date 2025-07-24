package com.backend.java_backend.Services;

import com.backend.java_backend.Classes.Logs;
import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.Classes.Stock;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.Repos.LogsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LogsService {

    @Autowired
    private final LogsRepo logsRepo;

    public LogsService(LogsRepo logsRepo) {
        this.logsRepo = logsRepo;
    }

    public Logs createLog(Stock stock, User user, Logs.MovementLog action) {
        Logs log = new Logs();
        log.setStock(stock);
        log.setProduct(stock.getProduct());
        log.setUser(user);
        log.setMovementLog(action);
        return logsRepo.save(log);
    }
}
