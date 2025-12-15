package com.example.backend.Repos;


import com.example.backend.Entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductItemRepo  extends JpaRepository<ProductItem, Integer> {
    List<ProductItem> findByProductId(Integer productId);
    @Query("SELECT pi FROM ProductItem pi JOIN FETCH pi.product WHERE pi.id = :id")
    Optional<ProductItem> findByIdWithProduct(@Param("id") Integer id);
}
