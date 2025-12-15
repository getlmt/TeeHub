package com.example.backend.DTO.Response;

import lombok.Data;

@Data
public class UserAddressDTO {
    private Integer user_id;
    private Integer address_id;
    private String unitNumber;
    private String addressLine1;
    private String city;
    private String emailAddress;
    private String phoneNumber;
}
