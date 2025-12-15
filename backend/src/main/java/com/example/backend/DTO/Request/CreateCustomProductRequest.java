package com.example.backend.DTO.Request;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateCustomProductRequest {
    private String name;
    private String description;
    private BigDecimal price;

}
