package com.example.backend.DTO.Response.Cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCartDTO {
    private Integer cartId;
    private Integer userId;
    private List<CartItemDTO> items;


}
