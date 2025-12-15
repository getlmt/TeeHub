package com.example.backend.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class PromotionAlreadyExistsException extends RuntimeException {
    public PromotionAlreadyExistsException(String message) {
        super(message);
    }
}