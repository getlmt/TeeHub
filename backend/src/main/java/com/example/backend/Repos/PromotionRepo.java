package com.example.backend.Repos;

import com.example.backend.Entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionRepo extends JpaRepository<Promotion, Integer> {
    List<Promotion> findByProduct_Id(Integer productId);

}