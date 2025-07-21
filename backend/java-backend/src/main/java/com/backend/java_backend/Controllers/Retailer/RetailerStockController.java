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
    private final String username = SecurityContextHolder.getContext().getAuthentication().getName();


    //get stocks by product ID
    @PostMapping("/get-stock-productId/{id}")
    public ResponseEntity<?> getStockProductId(@PathVariable Long id){
        List<Stock> stockList = stockService.findByProduct_Id(id);
        if(stockList.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Stock Not Found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(stockList);
    }

    //get stock by username mainly for home page of the retailer
    @GetMapping("/get-stock-username")
    public ResponseEntity<?> getStock(){
        List<Stock> stocksList = stockService.findAllByRetailerUsername(username);
        if(stocksList.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("NO STOCK");
        }
        return  ResponseEntity.status(HttpStatus.OK).body(stocksList);
    }

    //update stock by Stock id
    @PutMapping("/update-stock/{id}")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestBody Stock updatedStock) {
        try {
            Stock stock = stockService.updateStock(id, updatedStock);
            return ResponseEntity.status(HttpStatus.OK).body(stock);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //delete stock by stock Id
    @DeleteMapping("/delete-stock/{id}")
    public ResponseEntity<?> deleteStock(@PathVariable Long id) {
        Boolean deleteStockById = stockService.deleteStockById(id);
        if(!deleteStockById){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("NO STOCK");
        }
        return ResponseEntity.status(HttpStatus.OK).body("DELETED");
    }

    //update stock by order id
    @PostMapping("/update-stock")
    public ResponseEntity<?> updateStock(@RequestParam Long orderId) {
        try {
            stockService.updateRetailerStockFromOrder(orderId);
            return ResponseEntity.ok("Retailer stock updated successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong.");
        }
    }
}
