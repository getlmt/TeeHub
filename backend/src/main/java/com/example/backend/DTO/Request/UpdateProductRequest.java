package com.example.backend.DTO.Request;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
@Getter
@Setter
public class UpdateProductRequest {
    private String productName;
    private String productDescription;
    private String productMainImage;
    private Integer categoryId; // Chỉ cần ID
    private List<ItemSaveRequest> items;

    @Getter
    @Setter
    public static class ItemSaveRequest {
        private Integer productItemId; // Key: null = mới, not-null = cập nhật
        private String sku;
        private Integer qtyInStock;
        private String itemImage;
        private BigDecimal price;
        private List<Integer> variationOptionIds; // Chỉ cần danh sách ID
    }
}
