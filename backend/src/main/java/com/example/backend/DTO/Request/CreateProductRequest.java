package com.example.backend.DTO.Request;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CreateProductRequest {
    private String productName;
    private String productDescription;
    private String productMainImage;
    private Integer categoryId;
    private List<ItemCreateRequest> items;

    @Getter
    @Setter
    public static class ItemCreateRequest {
        private String sku;
        private Integer qtyInStock;
        private String itemImage;
        private BigDecimal price;
        private List<Integer> variationOptionIds;
    }
}
