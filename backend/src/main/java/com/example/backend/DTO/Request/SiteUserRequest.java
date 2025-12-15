package com.example.backend.DTO.Request;

//import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteUserRequest {

    public interface Create {}
    public interface Update {}

//    @Size(max = 255, groups = {Create.class, Update.class})
    private String full_name;
//
//    @Size(max = 1024, groups = {Create.class, Update.class})
    private String user_avatar;

//    @Email(groups = {Create.class, Update.class})
//    @NotBlank(groups = {Create.class})           // create bắt buộc, update optional
    private String email_address;

//    @Size(max = 20, groups = {Create.class, Update.class})
    private String phone_number;

    // create bắt buộc, update thì optional (nếu muốn đổi)
//    @Size(min = 6, max = 128, groups = {Create.class, Update.class})
//    @NotBlank(groups = {Create.class})
    private String password;   // dùng khi create; update: chỉ set nếu truyền

//    @Size(max = 20, groups = {Create.class, Update.class})
    private String role;

    // Trường riêng cho UPDATE để đổi mật khẩu
//    @Size(min = 6, max = 128, groups = {Update.class})
    private String new_password; // chỉ có ý nghĩa ở update
}
