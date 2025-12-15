package com.example.backend.Repos;

import com.example.backend.Entity.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ShoppingCartRepo extends JpaRepository<ShoppingCart, Integer> {
    Optional<ShoppingCart> findByUserId(Integer userId);
}
