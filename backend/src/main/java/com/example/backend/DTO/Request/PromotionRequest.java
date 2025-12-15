package com.example.backend.DTO.Request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class PromotionRequest {
    private String name;
    private String description;
    private BigDecimal discountRate;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer productId; // ID của danh mục sẽ áp dụng
}
