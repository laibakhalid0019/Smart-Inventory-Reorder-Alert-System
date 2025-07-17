package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepo extends JpaRepository<Stock,Integer> {

    Boolean deleteByProduct_Id(long productId);

    Stock findByProductIdAndOwnerId(long p_id, long u_id);
}
