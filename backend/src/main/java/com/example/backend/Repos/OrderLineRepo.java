package com.example.backend.Repos;

import com.example.backend.Entity.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderLineRepo extends JpaRepository<OrderLine, Integer> {
    List<OrderLine> findByShopOrderId(Integer orderId);
}

