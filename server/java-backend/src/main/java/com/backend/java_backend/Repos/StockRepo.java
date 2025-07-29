package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.Stock;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepo extends JpaRepository<Stock,Long> {

    List<Stock> findAllByRetailer_Id(Long retailerId);
    List<Stock> findAllByRetailerUsername(String retailerUsername);

    @Transactional
    Boolean deleteStockById(Long stockId);

    List<Stock> findByProduct_Id(Long productId);

    Optional<Stock> findByRetailerIdAndProductId(Long retailerId, Long productId);

    Stock findStockById(Long stockId);
}
