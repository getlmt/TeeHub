package com.example.backend.DTO.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUpdateCategoryRequest {
    private String categoryName;
    private Integer parentCategoryId;
}
