package com.example.backend.DTO.Response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VariationOptionResponse {
    private Integer variation_option_id;

    private Integer variation_id;
    private String  variation_name;

    private Integer category_id;
    private String  category_name;

    private String value;
}