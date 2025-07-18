package com.backend.java_backend.Services;

import com.backend.java_backend.Classes.Stock;
import com.backend.java_backend.Repos.StockRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {

    @Autowired
    private final StockRepo stockRepo;

    public StockService(StockRepo stockRepo) {
        this.stockRepo = stockRepo;
    }

    public List<Stock> findAllByRetailer_Id(Long id) {
        return  stockRepo.findAllByRetailer_Id(id);
    }

    public Boolean deleteStockById(Long stockId) {
        return stockRepo.deleteStockById(stockId);
    }
    public List<Stock> findByProduct_Id(Long productId) {
        return  stockRepo.findByProduct_Id(productId);
    }

    public List<Stock> findAllByRetailerUsername(String retailerUsername) {
        return stockRepo.findAllByRetailerUsername(retailerUsername);
    }

    public Stock updateStock(Long stockId, Stock updatedStock) {
        return stockRepo.findById(Math.toIntExact(stockId)).map(stock -> {
            stock.setQuantity(updatedStock.getQuantity());
            stock.setMin_threshold(updatedStock.getMin_threshold());
            stock.setExpiry_date(updatedStock.getExpiry_date());
            stock.setCreatedAt(updatedStock.getCreatedAt());
            return stockRepo.save(stock);
        }).orElseThrow(() -> new RuntimeException("Stock not found"));
    }
}
