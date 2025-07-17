package com.backend.java_backend.Services;

import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.Classes.MovementLog;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.Repos.MovementLogsRepo;
import com.backend.java_backend.Repos.UserRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MovementLogsService {
    private final MovementLogsRepo movementLogsRepo;
    private final UserRepo userRepo;
    public MovementLogsService(MovementLogsRepo movementLogsRepo, UserRepo userRepo) {
        this.movementLogsRepo = movementLogsRepo;
        this.userRepo = userRepo;
    }

    public boolean addLogsInTable(Product product, String username, String actionType) {
        try {
            MovementLog log = new MovementLog();
            //product id
            log.setProduct(product);
            //action type
            log.setActionType(actionType);
            //logged at
            log.setLoggedAt(LocalDateTime.now());
            //quantity
            log.setQuantity(product.getQuantity());
            //userid
            User user = userRepo.findByUsername(username);
            log.setUser(user);
            //details
            log.setDetails(actionType);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
