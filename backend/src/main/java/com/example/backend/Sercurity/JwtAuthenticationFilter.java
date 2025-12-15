package com.example.backend.Sercurity; // Hoặc package đúng của bạn

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger; // <-- Thêm import
import org.slf4j.LoggerFactory; // <-- Thêm import
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwt;
    private final UserDetailsService userDetailsService;
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String requestURI = request.getRequestURI();
        log.debug(">>> JwtAuthenticationFilter START for request: {}", requestURI);

        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String userEmail;

        // Bỏ qua nếu không có header Authorization hoặc không phải Bearer token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("No JWT token found in Authorization header for {}, continuing chain.", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        jwtToken = authHeader.substring(7);

        try {
            userEmail = jwt.extractUsername(jwtToken);

            // Nếu có email và chưa được xác thực trong context hiện tại
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                log.debug("JWT token extracted for user: {}. Loading UserDetails.", userEmail);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // Kiểm tra token có hợp lệ không (ví dụ: chưa hết hạn - JwtUtil nên làm việc này)
                // Lưu ý: Việc kiểm tra isExpired() có thể không cần thiết nếu extractUsername() đã ném ExpiredJwtException
                // if (jwt.isTokenValid(jwtToken, userDetails)) { // Giả sử có hàm isTokenValid

                // Tạo đối tượng Authentication
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Credentials là null vì dùng JWT
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Lưu Authentication vào SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.info("Successfully authenticated user '{}' via JWT for request: {}", userEmail, requestURI);
                // } else {
                //     log.warn("JWT token validation failed for user: {}", userEmail);
                // }
            } else {
                if (userEmail == null) log.warn("Could not extract username from JWT for request: {}", requestURI);
                // Nếu đã có Authentication thì bỏ qua
            }
            // === KẾT THÚC TRY ===

        } catch (ExpiredJwtException eje) {
            // Lỗi token hết hạn - nên trả về 401
            log.warn("JWT token has expired for request {}: {}", requestURI, eje.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Token has expired\"}"); // Trả về JSON lỗi
            return; // Dừng filter chain

        } catch (JwtException | IllegalArgumentException e) {
            // Các lỗi JWT khác (sai signature, malformed, ...) - nên trả về 401
            log.error("!!! Invalid JWT token for request {}: {}", requestURI, e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Invalid token\"}"); // Trả về JSON lỗi
            return; // Dừng filter chain

        } catch (UsernameNotFoundException unfe) {
            // Lỗi không tìm thấy user tương ứng với token - nên trả về 401
            log.error("!!! User not found for token in request {}: {}", requestURI, unfe.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"User associated with token not found\"}"); // Trả về JSON lỗi
            return; // Dừng filter chain

        } catch (Exception e) {
            // !!! LỖI KHÁC KHÔNG MONG ĐỢI !!! - Log chi tiết và trả về 500
            log.error("!!! UNEXPECTED ERROR in JwtAuthenticationFilter for {}: {}", requestURI, e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Internal server error during authentication\"}"); // Trả về JSON lỗi
            return; // Dừng filter chain
        }

        // Nếu mọi thứ ổn hoặc không có token, tiếp tục filter chain
        log.debug("<<< JwtAuthenticationFilter END for request: {}", requestURI);
        filterChain.doFilter(request, response);
    }


}