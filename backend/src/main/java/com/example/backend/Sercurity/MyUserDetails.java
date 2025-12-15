package com.example.backend.Sercurity; // Hoặc package đúng của bạn

import com.example.backend.DTO.Response.UserDetailsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;


@RequiredArgsConstructor // Lombok tạo constructor nhận DTO
public class MyUserDetails implements UserDetails {

    private final UserDetailsDTO userDetailsDTO; // Giữ tham chiếu đến DTO


    public Integer getId() {
        // Gọi getter từ UserDetailsDTO (Lombok đã tạo)
        return userDetailsDTO.getUserId();
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = userDetailsDTO.getRole(); // Lấy role từ DTO

        // Xử lý role null hoặc rỗng, mặc định là USER
        if (role == null || role.trim().isEmpty()) {
            role = "USER";
        } else {
            role = role.trim().toUpperCase();
        }

        // Đảm bảo có tiền tố "ROLE_"
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        // Trả về danh sách chỉ chứa một quyền
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }


    @Override
    public String getPassword() {
        // Lấy password từ DTO
        return userDetailsDTO.getPassword();
    }


    @Override
    public String getUsername() {
        // Lấy email từ DTO
        return userDetailsDTO.getEmailAddress();
    }
    public Integer getUserId() {
        return userDetailsDTO.getUserId();
    }


    @Override
    public boolean isAccountNonExpired() {
        return true; // Tài khoản không bao giờ hết hạn
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Tài khoản không bao giờ bị khóa
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Mật khẩu không bao giờ hết hạn
    }

    @Override
    public boolean isEnabled() {
        return true; // Tài khoản luôn được kích hoạt
    }


}