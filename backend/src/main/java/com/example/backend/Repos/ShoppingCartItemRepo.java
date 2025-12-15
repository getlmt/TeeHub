package com.example.backend.Repos;

import com.example.backend.Entity.ShoppingCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoppingCartItemRepo extends JpaRepository<ShoppingCartItem, Integer> {

    @Query("""
        SELECT pi.price
        FROM ProductItem pi
        JOIN ShoppingCartItem sci ON sci.productItemId = pi.id
        WHERE sci.id = :cartItemId
    """)
    Integer findPriceByCartItemId(Integer cartItemId);


    @Query("""
        SELECT pi.productImage
        FROM ProductItem pi
        JOIN ShoppingCartItem sci ON sci.productItemId = pi.id
        WHERE sci.id = :cartItemId
    """)
    String findProductImageByCartItemId(Integer cartItemId);

    List<ShoppingCartItem> findByCartId(Integer id);

    boolean existsByIdAndCart_UserId(Integer id, Integer userId);

    boolean existsByCustomProductId(Integer customProductId);
}