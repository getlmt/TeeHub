package com.example.backend.DTO.Response;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ProductResponse {
    private Integer productId;
    private String productName;
    private String productDescription;
    private String productMainImage;
    private CategoryInfo category;
    private List<ProductItemInfo> items;
    private Long totalSold;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoryInfo {
        private Integer categoryId;
        private String categoryName;
        private Integer parentCategoryId;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductItemInfo {
        private Integer productItemId;
        private String sku;
        private Integer qtyInStock;
        private String itemImage;
        private BigDecimal price; // GIÁ ĐÃ GIẢM
        private BigDecimal originalPrice; // giá gốc
        private BigDecimal discountRate; // % giảm giá (ví dụ: 20.00)
        private List<ConfigurationInfo> configurations;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ConfigurationInfo {
        private Integer variationOptionId;
        private String variationName;
        private String value;
    }
}