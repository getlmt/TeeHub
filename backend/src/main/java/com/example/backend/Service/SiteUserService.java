package com.example.backend.Service;

import com.example.backend.DTO.Request.SiteUserRequest;
import com.example.backend.DTO.Response.SiteUserResponse;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Repos.SiteUserRepo;
import com.example.backend.DTO.Request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SiteUserService {

    private final SiteUserRepo siteUserRepo;

    @Value("${app.avatar.dir}")
    private String avatarDir;

    @Value("${app.external.base-url}")
    private String baseUrl;


    private String normalizeRole(String rolePlain) {
        if (rolePlain == null || rolePlain.isBlank()) {
            return "ROLE_USER";
        }
        String up = rolePlain.trim().toUpperCase();
        if (up.startsWith("ROLE_")) up = up.substring(5);
        switch (up) {
            case "ADMIN":     return "ROLE_ADMIN";
            case "USER":      return "ROLE_USER";
            case "MODERATOR": return "ROLE_MODERATOR";
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role không hợp lệ: " + rolePlain);
        }
    }


    public SiteUser registerNewUser(RegisterRequest req) {
        String normalizedEmail = req.email().toLowerCase();

        if (siteUserRepo.existsByEmailAddress(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại: " + req.email());
        }

        var newUser = new SiteUser();
        newUser.setFullName(req.fullName());
        newUser.setEmailAddress(normalizedEmail);

        newUser.setPassword(req.password());
        newUser.setRole("ROLE_USER");

        return siteUserRepo.save(newUser);
    }


    public List<SiteUserResponse> getAllUsers() {
        return siteUserRepo.findAllAsDto();
    }

    public SiteUserResponse getUserById(Integer id) {
        return siteUserRepo.findDtoById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " không tồn tại."));
    }

    public List<SiteUserResponse> searchUsers(String keyword) {
        if (keyword == null || keyword.isBlank()) return getAllUsers();
        return siteUserRepo.searchAsDto(keyword.trim());
    }


    public SiteUserResponse createUser(SiteUserRequest req) {
        if (req.getEmail_address() == null || req.getEmail_address().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email là bắt buộc");
        }
        String emailLower = req.getEmail_address().trim().toLowerCase();

        if (siteUserRepo.existsByEmailAddress(emailLower)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại: " + req.getEmail_address());
        }
        if (req.getPassword() == null || req.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu là bắt buộc");
        }

        SiteUser su = new SiteUser();
        su.setFullName(req.getFull_name());
        su.setUserAvatar(req.getUser_avatar());
        su.setEmailAddress(emailLower);
        su.setPhoneNumber(req.getPhone_number());
        su.setPassword(req.getPassword());
        su.setRole(normalizeRole(req.getRole()));

        su = siteUserRepo.save(su);
        return mapToDto(su);
    }


    public void changePassword(Integer userId, String oldPassword, String newPassword) {
        SiteUser user = siteUserRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại"));

        if (!oldPassword.equals(user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không đúng");
        }

        user.setPassword(newPassword);
        siteUserRepo.save(user);
    }


    public SiteUserResponse updateUser(Integer id, SiteUserRequest req) {
        SiteUser su = siteUserRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " không tồn tại."));

        if (req.getFull_name() != null)    su.setFullName(req.getFull_name());
        if (req.getUser_avatar() != null)  su.setUserAvatar(req.getUser_avatar());
        if (req.getPhone_number() != null) su.setPhoneNumber(req.getPhone_number());

        if (req.getRole() != null) {
            su.setRole(normalizeRole(req.getRole()));
        }

        if (req.getNew_password() != null && !req.getNew_password().isBlank()) {
            su.setPassword(req.getNew_password());
        }

        su = siteUserRepo.save(su);
        return mapToDto(su);
    }

    public SiteUserResponse changeUserRole(Integer userId, String rolePlain) {
        SiteUser su = siteUserRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + userId + " không tồn tại."));
        su.setRole(normalizeRole(rolePlain));
        su = siteUserRepo.save(su);
        return mapToDto(su);
    }


    public void deleteUser(Integer id) {
        if (!siteUserRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " không tồn tại.");
        }
        siteUserRepo.deleteById(id);
    }


    @Transactional
    public String uploadAvatar(Integer userId, MultipartFile file) throws IOException {
        SiteUser user = siteUserRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User không tồn tại: " + userId));

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File rỗng hoặc không hợp lệ");
        }

        Path uploadDir = Paths.get(avatarDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String ext = "";
        String originalName = file.getOriginalFilename();
        int idx = originalName != null ? originalName.lastIndexOf('.') : -1;
        if (idx > 0) ext = originalName.substring(idx);
        String filename = UUID.randomUUID() + ext;

        Path target = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String old = user.getUserAvatar();
        if (old != null && old.contains("/avatars/")) {
            String oldFile = old.substring(old.lastIndexOf('/') + 1);
            Files.deleteIfExists(uploadDir.resolve(oldFile));
        }

        String avatarUrl = baseUrl.replaceAll("/+$", "") + "/avatars/" + filename;

        user.setUserAvatar(avatarUrl);
        siteUserRepo.save(user);
        return avatarUrl;
    }


    private SiteUserResponse mapToDto(SiteUser su) {
        return SiteUserResponse.builder()
                .id(su.getId())
                .full_name(su.getFullName())
                .user_avatar(su.getUserAvatar())
                .email_address(su.getEmailAddress())
                .phone_number(su.getPhoneNumber())
                .role(su.getRole())
                .build();
    }

    public SiteUser findById(Integer id) {
        return siteUserRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + id + " không tồn tại."));
    }
}
