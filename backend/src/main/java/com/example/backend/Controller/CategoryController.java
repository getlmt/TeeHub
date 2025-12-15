package com.example.backend.Controller;
import com.example.backend.DTO.Request.CreateUpdateCategoryRequest;
import com.example.backend.DTO.Response.CategoryResponse;
import com.example.backend.DTO.Response.CategoryWithCountResponse;
import com.example.backend.Service.CategoryCUDService;
import com.example.backend.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private CategoryCUDService categoryWriteService;

    @GetMapping
    public ResponseEntity<List<CategoryWithCountResponse>> getAllCategoriesWithCount() { // <-- Sửa kiểu trả về
        List<CategoryWithCountResponse> categoriesWithCount = categoryService.getAllCategoriesWithCount(); // <-- Gọi hàm service mới
        return ResponseEntity.ok(categoriesWithCount);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Integer id) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody CreateUpdateCategoryRequest request) {


        CategoryResponse newCategory = categoryWriteService.createCategory(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
    }
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Integer id,
            @RequestBody CreateUpdateCategoryRequest request) {

        CategoryResponse updatedCategory = categoryWriteService.updateCategory(id, request);
        return ResponseEntity.ok(updatedCategory); // Trả về 200 OK
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCategory(@PathVariable Integer id) {

        String message = categoryWriteService.deleteCategory(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", message);

        return ResponseEntity.ok(response);
    }
}
