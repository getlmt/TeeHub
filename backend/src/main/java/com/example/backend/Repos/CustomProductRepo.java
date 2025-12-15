package com.example.backend.Repos;

import com.example.backend.Entity.CustomProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // ✅ Import List
import java.util.Optional;

@Repository
public interface CustomProductRepo extends JpaRepository<CustomProduct, Integer> {

    Optional<CustomProduct> findByUserIdAndProductId(Integer userId, Integer productId);

    List<CustomProduct> findByUserId(Integer userId);

}