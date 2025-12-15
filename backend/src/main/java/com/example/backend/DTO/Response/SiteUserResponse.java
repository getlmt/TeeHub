package com.example.backend.DTO.Response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteUserResponse {
    private Integer id;
    private String full_name;
    private String user_avatar;
    private String email_address;
    private String phone_number;
    private String role;
}
