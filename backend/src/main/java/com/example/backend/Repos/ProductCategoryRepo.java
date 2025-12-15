package com.example.backend.Repos;

import com.example.backend.Entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCategoryRepo extends JpaRepository<ProductCategory, Integer> {
    boolean existsByCategoryName(String categoryName);
    boolean existsByCategoryNameAndIdNot(String categoryName, Integer id);
}
