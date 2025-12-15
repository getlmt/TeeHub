package com.example.backend.Controller;

import com.example.backend.DTO.Request.RegisterRequest;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Service.SiteUserService;
import com.example.backend.Sercurity.JwtUtil;
import com.example.backend.Sercurity.MyUserDetails;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwt;
    private final SiteUserService siteUserService;

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    // --- DTOs ---
    public record LoginRequest(String email, String password) {}
    public record LoginResponse(String accessToken, String email, String role, Integer userId) {}


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req, HttpServletResponse res) {
        log.info("Attempting registration for email: {}", req.email());

        // 1. Gọi Service đăng ký (Nếu trùng email, Service sẽ ném lỗi 409 -> GlobalExceptionHandler bắt)
        SiteUser newUser = siteUserService.registerNewUser(req);
        log.info("New user created with ID: {}", newUser.getId());

        // 2. Tự động đăng nhập cho user mới
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        log.info("Authentication successful for new user: {}", req.email());

        // 3. Tạo Token và Cookie
        return generateTokenAndResponse(auth, res);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletResponse res) {
        log.info("Attempting login for email: {}", req.email());

        // 1. Xác thực (Nếu sai pass, authManager ném BadCredentialsException -> GlobalHandler bắt)
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));

        log.info("Login successful for: {}", req.email());

        // 2. Tạo Token và Cookie
        return generateTokenAndResponse(auth, res);
    }


    private ResponseEntity<?> generateTokenAndResponse(Authentication auth, HttpServletResponse res) {
        var user = (MyUserDetails) auth.getPrincipal();
        List<String> roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        // Tạo Access & Refresh Token
        String access = jwt.generateToken(user.getUsername(), roles, Duration.ofMinutes(15));
        String refresh = jwt.generateToken(user.getUsername(), roles, Duration.ofDays(7));

        // Set Cookie
        ResponseCookie cookie = ResponseCookie.from("refresh_token", refresh)
                .httpOnly(true)
                .secure(false) // Set true nếu chạy HTTPS
                .sameSite("Lax")
                .path("/auth")
                .maxAge(Duration.ofDays(7))
                .build();
        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // Trả về JSON
        return ResponseEntity.ok(
                new LoginResponse(access, user.getUsername(), roles.isEmpty() ? "ROLE_USER" : roles.get(0), user.getId())
        );
    }


    @PostMapping("/refresh")
    public ResponseEntity<Map<String,String>> refresh(@CookieValue(name="refresh_token", required=false) String refresh) {
        if (refresh == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String email = jwt.extractUsername(refresh);
            // Tạm thời hardcode ROLE_USER, thực tế nên query DB lại để lấy role mới nhất
            List<String> roles = List.of("ROLE_USER");

            String access = jwt.generateToken(email, roles, Duration.ofMinutes(15));
            return ResponseEntity.ok(Map.of("accessToken", access));
        } catch (Exception e) {
            log.error("Error during token refresh: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse res) {
        ResponseCookie expired = ResponseCookie.from("refresh_token", "")
                .httpOnly(true).secure(false).sameSite("Lax").path("/auth").maxAge(0).build();
        res.addHeader(HttpHeaders.SET_COOKIE, expired.toString());
        return ResponseEntity.noContent().build();
    }
}