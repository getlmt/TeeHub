package com.example.backend.Sercurity;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Duration; // Import Duration
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${app.oauth2.authorized-redirect-uris}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        if (response.isCommitted()) {
            return;
        }

        String targetUrl = determineTargetUrl(request, response, authentication);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    @Override
    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 1. Lấy Username (Email)
        String email = userDetails.getUsername();

        // 2. Lấy danh sách Role (chuyển từ GrantedAuthority sang List<String>)
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // 3. Định nghĩa thời hạn token (Ví dụ: 7 ngày)
        // Hàm generateToken của bạn yêu cầu tham số thứ 3 là Duration
        Duration duration = Duration.ofDays(7);

        // --- GỌI HÀM VỚI ĐỦ 3 THAM SỐ ---
        String token = jwtUtil.generateToken(email, roles, duration);

        return UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .build().toUriString();
    }
}