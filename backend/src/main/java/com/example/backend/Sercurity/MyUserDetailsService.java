package com.example.backend.Sercurity;

import com.example.backend.DTO.Response.UserDetailsDTO;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.SiteUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private final SiteUserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        final String key = email == null ? "" : email.trim();

        SiteUser userEntity = repo.findByEmailAddress(key)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + key));

        // Chuyển đổi Entity sang UserDetailsDTO
        UserDetailsDTO userDetailsDTO = mapEntityToUserDetailsDTO(userEntity);

        // Đưa UserDetailsDTO vào MyUserDetails
        return new MyUserDetails(userDetailsDTO);
    }

    // Hàm chuyển đổi sang DTO nội bộ
    private UserDetailsDTO mapEntityToUserDetailsDTO(SiteUser entity) {
        UserDetailsDTO dto = new UserDetailsDTO();
        dto.setUserId(entity.getUserId()); // <-- Lấy ID
        dto.setEmailAddress(entity.getEmailAddress());
        dto.setPassword(entity.getPassword()); // <-- Lấy Password
        dto.setRole(entity.getRole());
        return dto;
    }
}