package com.example.backend.Service;

import com.example.backend.DTO.Request.CreateUpdateCategoryRequest;
import com.example.backend.DTO.Response.CategoryResponse;
import com.example.backend.Entity.ProductCategory;
import com.example.backend.Exception.CategoryNameAlreadyExistsException;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.ProductCategoryRepo;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// Nhớ import Exception mới của bạn

@Service
public class CategoryCUDService {
    @Autowired
    private ProductCategoryRepo categoryRepo;


    @Transactional
    public CategoryResponse createCategory(CreateUpdateCategoryRequest request) {

        // 1. Kiểm tra trùng lặp tên
        if (categoryRepo.existsByCategoryName(request.getCategoryName())) {
            // Ném ra Exception mới của bạn
            throw new CategoryNameAlreadyExistsException("Category with name '" + request.getCategoryName() + "' already exists.");
        }

        // 2. Tạo Entity mới
        ProductCategory category = new ProductCategory();
        category.setCategoryName(request.getCategoryName());

        // 3. Xử lý category cha (nếu có)
        if (request.getParentCategoryId() != null) {
            ProductCategory parent = categoryRepo.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("ParentCategory not found with id: " + request.getParentCategoryId()));
            category.setParentCategory(parent);
        }

        // 4. Lưu vào DB
        ProductCategory savedCategory = categoryRepo.save(category);

        // 5. Trả về DTO Response
        return new CategoryResponse(savedCategory);
    }


    @Transactional
    public CategoryResponse updateCategory(Integer categoryId, CreateUpdateCategoryRequest request) {

        // 1. Tìm category cần sửa
        ProductCategory category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        // 2. Kiểm tra trùng lặp tên
        // (Chỉ check nếu tên đã thay đổi)
        if (!category.getCategoryName().equals(request.getCategoryName())) {
            if (categoryRepo.existsByCategoryNameAndIdNot(request.getCategoryName(), categoryId)) {
                throw new CategoryNameAlreadyExistsException("Category with name '" + request.getCategoryName() + "' already exists.");
            }
        }

        // 3. Cập nhật các trường
        category.setCategoryName(request.getCategoryName());

        // 4. Cập nhật category cha
        if (request.getParentCategoryId() != null) {
            // Ngăn người dùng set cha là chính nó
            if (request.getParentCategoryId().equals(categoryId)) {
                throw new IllegalArgumentException("Category cannot be its own parent.");
            }
            ProductCategory parent = categoryRepo.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("ParentCategory not found with id: " + request.getParentCategoryId()));
            category.setParentCategory(parent);
        } else {
            category.setParentCategory(null); // Gỡ bỏ cha
        }

        // 5. Lưu
        ProductCategory savedCategory = categoryRepo.save(category);

        // 6. Trả về DTO
        return new CategoryResponse(savedCategory);
    }


    @Transactional
    public String deleteCategory(Integer categoryId) {

        // 1. Kiểm tra tồn tại
        if (!categoryRepo.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found with id: " + categoryId);
        }

        // 2. Xoá
        categoryRepo.deleteById(categoryId);

        return "Deleted category successful with id: " + categoryId;
    }
}
