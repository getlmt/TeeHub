package com.example.backend.DTO.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactRequest {
    @NotEmpty(message = "Họ tên không được để trống")
    private String name;

    @NotEmpty(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    private String phone;

    @NotEmpty(message = "Chủ đề không được để trống")
    private String subject;

    @NotEmpty(message = "Tin nhắn không được để trống")
    private String message;
}
