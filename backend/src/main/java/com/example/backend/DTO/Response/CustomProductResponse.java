package com.example.backend.DTO.Response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomProductResponse {
    private Integer id;
    private String customName;
    private Integer productId;
    private String customImageUrl;
    private Integer userId;
    private String description;
    private String price;
}
