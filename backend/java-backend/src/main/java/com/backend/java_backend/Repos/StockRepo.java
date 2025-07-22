package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepo extends JpaRepository<Stock,Integer> {

    List<Stock> findAllByRetailer_Id(Long retailerId);
    List<Stock> findAllByRetailerUsername(String retailerUsername);
    Boolean deleteStockById(Long stockId);

    List<Stock> findByProduct_Id(Long productId);

    Optional<Stock> findByRetailerIdAndProductId(Long retailerId, Long productId);
}
