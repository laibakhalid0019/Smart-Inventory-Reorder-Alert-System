package com.backend.java_backend.Repos;

import com.backend.java_backend.Classes.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface RequestRepo extends JpaRepository<Request,Long> {
    List<Request> findAllByRetailer_Id(Long id);

    @Transactional
    @Modifying
    @Query("DELETE FROM Request r WHERE r.requestId = ?1")
    int deleteRequestByRequestId(Long id);

    List<Request> findAllByStatus(Request.Status status);
    Request findByRequestId(long id);
    List<Request> findAllByDistributor_Id(Long distributorId);
    List<Request> findAllByRetailer_IdAndStatus(Long retailerId, Request.Status status);
    boolean existsByProduct_Id(Long productId);
}
