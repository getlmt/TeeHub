package com.example.backend.DTO.Response;

import com.example.backend.Entity.Promotion;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class PromotionResponse {
    private Integer promotionId;
    private String name;
    private String description;
    private BigDecimal discountRate;
    private LocalDate startDate;
    private LocalDate endDate;

    private Integer productId;
    private String productName;

    public PromotionResponse(Promotion entity) {
        this.promotionId = entity.getId();
        this.name = entity.getName();
        this.description = entity.getDescription();
        this.discountRate = entity.getDiscountRate();
        this.startDate = entity.getStartDate();
        this.endDate = entity.getEndDate();

        if (entity.getProduct() != null) {
            this.productId = entity.getProduct().getId();
            this.productName = entity.getProduct().getName();
        }
    }
}