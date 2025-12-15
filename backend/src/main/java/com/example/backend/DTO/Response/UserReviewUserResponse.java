package com.example.backend.DTO.Response;
import com.example.backend.Entity.SiteUser;
import lombok.Getter;

@Getter
public class UserReviewUserResponse {
    private Integer userId;
    private String fullName;
    private String userAvatar;

    public UserReviewUserResponse(SiteUser user) {
        if (user != null) {
            this.userId = user.getUserId();
            this.fullName = user.getFullName();
            this.userAvatar = user.getUserAvatar();
        }
    }
}
