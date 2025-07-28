package com.backend.java_backend.Services;

import com.backend.java_backend.Classes.Logs;
import com.backend.java_backend.Classes.Order;
import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.Classes.Stock;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.Repos.OrderRepo;
import com.backend.java_backend.Repos.StockRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockService {

    @Autowired
    private final StockRepo stockRepo;

    @Autowired
    private final OrderRepo orderRepo;

    @Autowired
    private LogsService logsService;

    public StockService(StockRepo stockRepo, OrderRepo orderRepo) {
        this.stockRepo = stockRepo;
        this.orderRepo = orderRepo;
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

    public void updateRetailerStockFromOrder(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found."));

        if (order.getStatus() != Order.Status.DELIVERED) {
            throw new IllegalStateException("Order must be marked as DELIVERED before updating stock.");
        }

        User user = order.getRetailer();
        Long retailerId = user.getId();
        Product product = order.getProduct();
        Long productId = product.getId();
        int quantityToAdd = order.getQuantity();

        boolean isNewStock = false;
        Stock stock = stockRepo.findByRetailerIdAndProductId(retailerId, productId)
                .orElseGet(() -> {
                    Stock newStock = new Stock();
                    newStock.setRetailer(order.getRetailer());
                    newStock.setProduct(order.getProduct());
                    newStock.setQuantity(0);
                    return newStock;
                });

        // Determine if this is a new stock entry or an update
        isNewStock = stock.getId() == null;

        stock.setQuantity(stock.getQuantity() + quantityToAdd);
        stock.setCreatedAt(LocalDateTime.now());
        stock.setExpiry_date(product.getExpiry_date());
        Stock savedStock = stockRepo.save(stock);

        // Log the appropriate action
        if (isNewStock) {
            logsService.createLog(savedStock, user, Logs.MovementLog.ADD);
        } else {
            logsService.createLog(savedStock, user, Logs.MovementLog.UPDATE);
        }
    }

    public Stock findById(Long id) {
        return stockRepo.findById(Math.toIntExact(id)).orElse(null);
    }
}
