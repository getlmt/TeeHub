package com.example.backend.Service;

import com.example.backend.DTO.Response.CategoryResponse;
import com.example.backend.DTO.Response.CategoryWithCountResponse;
import com.example.backend.Entity.ProductCategory;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.ProductCategoryRepo;
import com.example.backend.Repos.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final ProductCategoryRepo categoryRepo;
    private final ProductRepo productRepo;

    public List<CategoryWithCountResponse> getAllCategoriesWithCount() {
        List<ProductCategory> categories = categoryRepo.findAll();

        return categories.stream()
                .map(category -> {
                    long count = productRepo.countByCategoryId(category.getId());

                    return new CategoryWithCountResponse(
                            category.getId(),
                            category.getCategoryName(),
                            count
                    );
                })
                .collect(Collectors.toList());
    }


    public CategoryResponse getCategoryById(Integer categoryId) {
        ProductCategory category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        return new CategoryResponse(category);
    }

}
