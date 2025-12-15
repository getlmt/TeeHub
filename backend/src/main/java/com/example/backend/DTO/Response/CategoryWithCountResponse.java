package com.example.backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryWithCountResponse {
    private Integer categoryId;
    private String categoryName;
    private long productCount; // Số lượng sản phẩm
}
