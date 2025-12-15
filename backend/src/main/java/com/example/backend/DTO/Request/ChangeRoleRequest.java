package com.example.backend.DTO.Request;

import lombok.Data;

@Data
public class ChangeRoleRequest {
    // "ADMIN" | "USER" | "MODERATOR" (không cần ROLE_ ở đây)
    private String role;

    // mật khẩu của admin đang thao tác (re-auth)
    private String admin_password;
}
