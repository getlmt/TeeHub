package com.example.backend.DTO.Response;

import com.example.backend.Entity.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponse {
    private Integer categoryId;
    private String categoryName;
    private Integer parentCategoryId; // Chỉ trả về ID của cha


    public CategoryResponse(ProductCategory entity) {
        this.categoryId = entity.getId();
        this.categoryName = entity.getCategoryName();

        // Kiểm tra null cho parentCategory
        if (entity.getParentCategory() != null) {
            this.parentCategoryId = entity.getParentCategory().getId();
        } else {
            this.parentCategoryId = null;
        }
    }
}
