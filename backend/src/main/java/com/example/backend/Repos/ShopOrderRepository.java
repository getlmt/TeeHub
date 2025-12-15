package com.example.backend.Repos;

import com.example.backend.Entity.ShopOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopOrderRepository extends JpaRepository<ShopOrder, Integer> {
    @Query(value = """
        SELECT EXISTS (
            SELECT 1
            FROM ecommerce.shop_order so
            JOIN ecommerce.order_line ol ON so.order_id = ol.order_id
            JOIN ecommerce.product_item pi ON ol.product_item_id = pi.product_item_id
            WHERE so.user_id = :userId
            AND pi.product_id = :productId
            AND so.payment_status = 'Đã thanh toán'
        )
    """, nativeQuery = true)
    boolean hasUserPurchasedProduct(@Param("userId") Integer userId, @Param("productId") Integer productId);
}
