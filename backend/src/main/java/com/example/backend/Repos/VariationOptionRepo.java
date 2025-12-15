package com.example.backend.Repos;
import com.example.backend.DTO.Response.VariationOptionResponse;

import com.example.backend.Entity.VariationOption;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariationOptionRepo extends JpaRepository<VariationOption, Integer> {


    @Query("""
        select new com.example.backend.DTO.Response.VariationOptionResponse(
            vo.id,            
            v.id,              
            v.name,            
            c.id,             
            c.categoryName,   
            vo.value           
        )
        from VariationOption vo
        left join vo.variation v
        left join v.category c
        """)
    List<VariationOptionResponse> findAllAsDto();

    @Query("""
        select new com.example.backend.DTO.Response.VariationOptionResponse(
            vo.id,
            v.id,
            v.name,
            c.id,
            c.categoryName,
            vo.value
        )
        from VariationOption vo
        left join vo.variation v
        left join v.category c
        where v.id = :variationId
        """)
    List<VariationOptionResponse> findByVariationIdAsDto(@Param("variationId") Integer variationId);

    @Query("""
        select new com.example.backend.DTO.Response.VariationOptionResponse(
            vo.id,
            v.id,
            v.name,
            c.id,
            c.categoryName,
            vo.value
        )
        from VariationOption vo
        left join vo.variation v
        left join v.category c
        where c.id = :categoryId
        """)
    List<VariationOptionResponse> findByCategoryIdAsDto(@Param("categoryId") Integer categoryId);

    @Query("""
        select new com.example.backend.DTO.Response.VariationOptionResponse(
            vo.id,
            v.id,
            v.name,
            c.id,
            c.categoryName,
            vo.value
        )
        from VariationOption vo
        left join vo.variation v
        left join v.category c
        where lower(vo.value) like lower(concat('%', :keyword, '%'))
        """)
    List<VariationOptionResponse> searchByValueAsDto(@Param("keyword") String keyword);
}
