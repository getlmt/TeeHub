package com.example.backend.Exception;

public class CategoryNameAlreadyExistsException extends RuntimeException {
    public CategoryNameAlreadyExistsException(String message) {
        super(message);
    }
}
