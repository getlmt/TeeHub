package com.example.backend.DTO.Response.Cart;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VariationOptionDTO {
    private Integer id;           // variation_option_id
    private Integer variationId;  // variation_id
    private String value;         // ví dụ: "Đỏ", "XXL"
}