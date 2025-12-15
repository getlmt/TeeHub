package com.example.backend.Repos;

import com.example.backend.Entity.Product;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Entity.UserReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserReviewRepo extends JpaRepository<UserReview, Integer> {

    List<UserReview> findByOrderedProduct_Product_IdOrderByCreatedAtDesc(Integer productId);

    @Query("SELECT COALESCE(AVG(r.ratingValue), 0.0), COUNT(r) " +
            "FROM UserReview r " +
            "WHERE r.orderedProduct.product.id = :productId")
    List<Object[]> getRatingStatsForProduct(@Param("productId") Integer productId);
    boolean existsByUserAndOrderedProduct_Product(SiteUser user, Product product);
    Page<UserReview> findByRatingValue(int ratingValue, Pageable pageable);
}