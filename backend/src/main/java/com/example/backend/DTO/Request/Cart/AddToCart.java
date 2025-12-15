package com.example.backend.DTO.Request.Cart;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class AddToCart {

    private String productImage;
    private List<Integer> selectedOptions; // ID của VariationOption

    private Integer productItemId;

    private Integer qty;
    private Integer price;

    @JsonProperty("is_customed")
    private Boolean isCustomed = false;

    @JsonProperty("custom_product_id")
    private Integer customProductId;


}
