package com.example.backend.Repos;

import com.example.backend.DTO.Response.Cart.CartItemDTO;
import com.example.backend.DTO.Response.Cart.UserCartDTO;
import com.example.backend.Entity.ShoppingCart;
import lombok.Getter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@SuppressWarnings("ALL")

@Repository
public interface UserCartRepo extends JpaRepository<com.example.backend.Entity.ShoppingCartItem, Integer> {

    @Query(value = """
        SELECT 
            p.product_id,
            p.name AS product_name,
            pi.price,
            sci.qty,
            v.name AS variation_name,
            vo.value AS variation_value
        FROM shopping_cart_item sci
        JOIN product_item pi ON sci.product_item_id = pi.product_item_id
        JOIN product p ON pi.product_id = p.product_id
        LEFT JOIN product_configuration pc ON pi.product_item_id = pc.product_item_id
        LEFT JOIN variation_option vo ON pc.variation_option_id = vo.variation_option_id
        LEFT JOIN variation v ON vo.variation_id = v.variation_id
        WHERE sci.cart_id = :cartId
    """, nativeQuery = true)
    List<Object[]> getCartItemsByCartId(@Param("cartId") Integer cartId);
}
