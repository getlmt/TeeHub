package com.example.backend.DTO.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserReviewCreateRequest {
    private Integer productItemId; // ID của biến thể (currentItem)
    private Integer userId;      // ID của người đang đăng nhập
    private Integer ratingValue;
    private String comment;
}
