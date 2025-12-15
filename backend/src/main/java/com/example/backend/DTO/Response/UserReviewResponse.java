package com.example.backend.DTO.Response;

import com.example.backend.Entity.UserReview;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserReviewResponse {
    private Integer id;
    private Integer ratingValue;
    private String comment;
    private String userName;
    private String userAvatar;
    private String createdAt;

    private UserReviewUserResponse user;

    public UserReviewResponse(UserReview entity) {
        this.id = entity.getId();
        this.ratingValue = entity.getRatingValue();
        this.comment = entity.getComment();

        try {
            if (entity.getUser() != null) {
                this.userName = entity.getUser().getFullName();
                this.userAvatar = entity.getUser().getUserAvatar();
            } else {
                this.userName = "Anonymous";
            }
        } catch (org.hibernate.LazyInitializationException ex) {
            this.userName = "Anonymous";
            this.userAvatar = null;
        }
        this.createdAt = entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null;
        this.user = new UserReviewUserResponse(entity.getUser());
    }
}