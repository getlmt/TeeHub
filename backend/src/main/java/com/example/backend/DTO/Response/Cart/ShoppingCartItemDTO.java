package com.example.backend.DTO.Response.Cart;

import com.example.backend.Entity.VariationOption;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ShoppingCartItemDTO {
    private Integer id;
    private Integer cartId;
    private String productName;
    private Integer productItemId;
    private Integer qty;
    private Integer price;
    private String productImage;
    private Boolean is_customed;
    private Integer custom_id;
    private List<VariationOptionDTO> selectedOptions;
    private Integer stock;
}
