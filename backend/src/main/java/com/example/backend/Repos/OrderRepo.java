package com.example.backend.Repos;

import com.example.backend.Entity.ShopOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<ShopOrder, Integer> {
    List<ShopOrder> findByUserId(Integer userId);
}
