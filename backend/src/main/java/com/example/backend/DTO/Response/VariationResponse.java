package com.example.backend.DTO.Response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VariationResponse {
    private Integer variation_id;
    private Integer category_id;
    private String category_name;
    private String name;
}