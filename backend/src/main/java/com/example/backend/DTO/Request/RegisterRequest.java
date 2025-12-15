package com.example.backend.DTO.Request;

// DTO này nhận dữ liệu từ frontend (AuthPage.jsx)
public record RegisterRequest(
        String fullName,
        String email,
        String password
) {}