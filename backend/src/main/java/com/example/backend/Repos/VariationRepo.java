package com.example.backend.Repos;

import com.example.backend.DTO.Response.VariationResponse;
import com.example.backend.Entity.Variation;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariationRepo extends JpaRepository<Variation, Integer> {

    @Query("""
        select new com.example.backend.DTO.Response.VariationResponse(
            v.id,         
            c.id,        
            c.categoryName, 
            v.name        
        )
        from Variation v
        left join v.category c
        """)
    List<VariationResponse> findAllAsDto();

    @Query("""
        select new com.example.backend.DTO.Response.VariationResponse(
            v.id,
            c.id,
            c.categoryName,
            v.name
        )
        from Variation v
        left join v.category c
        where c.id = :categoryId
        """)
    List<VariationResponse> findByCategoryIdAsDto(@Param("categoryId") Integer categoryId);

    @Query("""
        select new com.example.backend.DTO.Response.VariationResponse(
            v.id,
            c.id,
            c.categoryName,
            v.name
        )
        from Variation v
        left join v.category c
        where lower(v.name) like lower(concat('%', :keyword, '%'))
        """)
    List<VariationResponse> searchByNameAsDto(@Param("keyword") String keyword);
}
