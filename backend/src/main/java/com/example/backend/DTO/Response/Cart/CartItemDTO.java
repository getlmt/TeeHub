package com.example.backend.DTO.Response.Cart;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class CartItemDTO {
    private Integer cartItemId;
    private Integer productItemId;
    private String productName;
    private String productImage;
    private Double price;
    private Integer quantity;
    private List<VariationOptionDTO> variations;

    public <E> CartItemDTO(Integer productId, String productName, Double price, Integer quantity, ArrayList<E> es) {
    }
}