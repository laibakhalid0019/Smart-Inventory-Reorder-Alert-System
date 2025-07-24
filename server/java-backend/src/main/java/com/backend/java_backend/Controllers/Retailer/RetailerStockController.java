package com.backend.java_backend.Controllers.Retailer;
import com.backend.java_backend.Classes.Stock;
import com.backend.java_backend.Services.StockService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/retailer/stocks")
public class RetailerStockController {

    @Autowired
    private StockService stockService;

    // Get stocks by product ID
    @PostMapping("/get-stock-productId/{id}")
    public ResponseEntity<?> getStockProductId(@PathVariable Long id) {
        try {
            List<Stock> stockList = stockService.findByProduct_Id(id);
            if (stockList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Stock not found for product ID: " + id);
            }
            return ResponseEntity.ok(stockList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while retrieving stock.");
        }
    }

    // Get stock by retailer username (for home page)
    @GetMapping("/get-stock-username")
    public ResponseEntity<?> getStock() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<Stock> stocksList = stockService.findAllByRetailerUsername(username);
            if (stocksList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No stock found for retailer.");
            }
            return ResponseEntity.ok(stocksList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while retrieving retailer stock.");
        }
    }

    // Update stock by stock ID
    @PutMapping("/update-stock/{id}")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestBody Stock updatedStock) {
        try {
            Stock stock = stockService.updateStock(id, updatedStock);
            return ResponseEntity.ok(stock);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while updating stock.");
        }
    }

    // Delete stock by stock ID
    @DeleteMapping("/delete-stock/{id}")
    public ResponseEntity<?> deleteStock(@PathVariable Long id) {
        try {
            boolean isDeleted = stockService.deleteStockById(id);
            if (!isDeleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Stock not found or cannot be deleted.");
            }
            return ResponseEntity.ok("Stock deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while deleting stock.");
        }
    }

    // Update stock based on order ID
    @PostMapping("/update-stock")
    public ResponseEntity<?> updateStockFromOrder(@RequestParam Long orderId) {
        try {
            stockService.updateRetailerStockFromOrder(orderId);
            return ResponseEntity.ok("Retailer stock updated successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while updating stock from order.");
        }
    }
    //export stock
    @GetMapping("/export-stock")
    public ResponseEntity<?> exportStockCSV() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<Stock> stocks = stockService.findAllByRetailerUsername(username);

            StringBuilder csvBuilder = new StringBuilder();
            csvBuilder.append("Stock ID,Product,Quantity,Created At\n");

            for (Stock stock : stocks) {
                csvBuilder.append(stock.getId()).append(",")
                        .append(stock.getProduct().getName()).append(",")
                        .append(stock.getQuantity()).append(",")
                        .append(stock.getCreatedAt()).append("\n");
            }

            byte[] csvBytes = csvBuilder.toString().getBytes();
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=stock_report.csv")
                    .header("Content-Type", "text/csv")
                    .body(csvBytes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to export stock data.");
        }
    }

}
