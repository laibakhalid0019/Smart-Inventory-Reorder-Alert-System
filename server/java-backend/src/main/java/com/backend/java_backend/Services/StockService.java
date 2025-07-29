package com.backend.java_backend.Services;

import com.backend.java_backend.Classes.Order;
import com.backend.java_backend.Classes.Product;
import com.backend.java_backend.Classes.Stock;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.DTOs.StockDTO;
import com.backend.java_backend.Repos.OrderRepo;
import com.backend.java_backend.Repos.ProductRepo;
import com.backend.java_backend.Repos.StockRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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
    private ProductRepo productRepo;
    @Autowired
    private LogsService logsService;

    public StockService(StockRepo stockRepo, OrderRepo orderRepo) {
        this.stockRepo = stockRepo;
        this.orderRepo = orderRepo;
    }

    public List<Stock> findAllByRetailer_Id(Long id) {
        return  stockRepo.findAllByRetailer_Id(id);
    }

    @Transactional
    public Boolean deleteStockById(Long stockId) {
        try {
            if (stockRepo.existsById(stockId)) {
                stockRepo.deleteById(stockId);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    public List<Stock> findByProduct_Id(Long productId) {
        return  stockRepo.findByProduct_Id(productId);
    }

    public List<Stock> findAllByRetailerUsername(String retailerUsername) {
        return stockRepo.findAllByRetailerUsername(retailerUsername);
    }

    @Transactional
    public Stock updateStock(Long stockId, StockDTO updatedStock) {
        // Find stock by ID directly
        Stock stock = stockRepo.findStockById(stockId);

        // Update stock-specific fields
        stock.setQuantity(updatedStock.getQuantity());
        stock.setMin_threshold(updatedStock.getMin_threshold());

        return stockRepo.save(stock);
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

        Stock stock = stockRepo.findByRetailerIdAndProductId(retailerId, productId)
                .orElseGet(() -> {
                    Stock newStock = new Stock();
                    newStock.setRetailer(order.getRetailer());
                    newStock.setProduct(order.getProduct());
                    newStock.setQuantity(0);
                    return newStock;
                });

        stock.setQuantity(stock.getQuantity() + quantityToAdd);
        stock.setCreatedAt(LocalDateTime.now());
        stock.setMin_threshold(product.getMst());
        stockRepo.save(stock);
    }

    public Stock findById(Long id) {
        return stockRepo.findStockById(id);
    }

    // Method to update logs before stock deletion
    @Transactional
    public boolean deleteStockAndUpdateLogs(Long stockId) {
        try {
            // Find the stock we want to delete
            Stock stock = stockRepo.findById(stockId).orElse(null);
            if (stock == null) {
                return false;
            }

            // Update all logs that reference this stock
            logsService.nullifyStockReferences(stockId);

            // Now delete the stock
            stockRepo.deleteById(stockId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
