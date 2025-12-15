package com.example.backend.Repos;

import com.example.backend.DTO.Response.Cart.CartItemDTO;
import com.example.backend.Entity.ShoppingCartItem;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface CartItemRepo extends JpaRepository<ShoppingCartItem, Integer> {

}
