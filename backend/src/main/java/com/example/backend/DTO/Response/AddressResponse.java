package com.example.backend.DTO.Response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {
    private Integer id;
    private String unit_number;
    private String street_number;
    private String address_line;
    private Boolean is_default;
}
