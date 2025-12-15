package com.example.backend.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private Map<String, String> createErrorBody(String message) {
        Map<String, String> body = new HashMap<>();
        body.put("message", message);
        return body;
    }

    // 1. Xử lý ResponseStatusException
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatusException(ResponseStatusException ex) {
        // Trả về JSON: { "message": "Email đã tồn tại..." } thay vì String thô
        return ResponseEntity
                .status(ex.getStatusCode())
                .body(createErrorBody(ex.getReason()));
    }

    // 2. Xử lý lỗi đăng nhập sai
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(createErrorBody("Email hoặc mật khẩu không chính xác."));
    }

    // 3. Các Exception tùy chỉnh khác
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(createErrorBody(ex.getMessage()));
    }

    @ExceptionHandler(InvalidDataException.class)
    public ResponseEntity<Object> handleInvalidData(InvalidDataException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(createErrorBody(ex.getMessage()));
    }

    @ExceptionHandler(CategoryNameAlreadyExistsException.class)
    public ResponseEntity<Object> handleCategoryNameAlreadyExistsException(
            CategoryNameAlreadyExistsException ex, WebRequest request) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Conflict");
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    // 4. Xử lý lỗi chung (Server Error)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneric(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorBody("Lỗi máy chủ: " + ex.getMessage()));
    }
}