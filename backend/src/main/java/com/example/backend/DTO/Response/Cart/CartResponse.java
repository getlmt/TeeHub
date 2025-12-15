package com.example.backend.DTO.Response.Cart;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@Table(name = "site_user", schema = "ecommerce")
public class CartResponse {
    private Integer id;
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    private List<ShoppingCartItemDTO> items;
}
