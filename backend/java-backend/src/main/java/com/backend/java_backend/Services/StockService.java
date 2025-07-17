package com.backend.java_backend.Services;

import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.Classes.Stock;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.Repos.MovementLogsRepo;
import com.backend.java_backend.Repos.ProductRepo;
import com.backend.java_backend.Repos.StockRepo;
import com.backend.java_backend.Repos.UserRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class StockService {
    private final StockRepo stockRepo;
    private final ProductRepo productRepo;
    private final UserRepo userRepo;
    private final MovementLogsRepo movementLogsRepo;
    public StockService(StockRepo stockRepo, ProductRepo productRepo, UserRepo userRepo, MovementLogsRepo movementLogsRepo) {
        this.stockRepo = stockRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.movementLogsRepo = movementLogsRepo;
    }

    //add stocks
    public void addStock(Product product, String username) {
        Stock stock = new Stock();
        stock.setProduct(product);
        stock.setQuantity(product.getQuantity());
        User user = userRepo.findByUsername(username);
        stock.setOwner(user);
        stock.setLastUpdated(LocalDateTime.now());
        stock.setCostPrice(product.getCost_price());
        stock.setRetailPrice(product.getRetail_price());
        stock.setMinThreshold(product.getMst());

        stockRepo.save(stock);
    }
    //delete stock
    public boolean deleteStock(long productId){
        return stockRepo.deleteByProduct_Id(productId);
    }
    //update stock
    public boolean updateStock(Product product, String username) {
        User user = userRepo.findByUsername(username);
        Stock existingStock = stockRepo.findByProductIdAndOwnerId(product.getId(), user.getId());

        if (existingStock == null) {
            return false;
        }

        existingStock.setCostPrice(product.getCost_price());
        existingStock.setRetailPrice(product.getRetail_price());
        existingStock.setMinThreshold(product.getMst());
        existingStock.setLastUpdated(LocalDateTime.now());

        stockRepo.save(existingStock);
        return true;
    }


}
