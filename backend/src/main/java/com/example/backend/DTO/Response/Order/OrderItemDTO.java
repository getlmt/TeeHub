package com.example.backend.DTO.Response.Order;

import com.example.backend.DTO.Response.Cart.VariationOptionDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderItemDTO {
    private Integer id;                      // ID của OrderLine
    private Integer productItemId;           // ID sản phẩm gốc (ProductItem)
    private Integer qty;                     // Số lượng
    private Integer price;                   // Giá (1 sản phẩm hoặc tổng tùy bạn)
    private String productImage;             // Ảnh sản phẩm hoặc custom
    private Boolean is_customed;              // true nếu là sản phẩm tuỳ chỉnh
    private Integer custom_id;                // ID của CustomProduct nếu có
    private List<VariationOptionDTO> selectedOptions; // Các lựa chọn (size, màu,...)
}
