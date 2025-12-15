package com.example.backend.Sercurity;

// Đảm bảo import đúng đường dẫn 2 file service mới tạo
import com.example.backend.Service.CustomOAuth2UserService;
import com.example.backend.Sercurity.OAuth2AuthenticationSuccessHandler;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final UserDetailsService myUserDetailsService;

    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        //  PHẦN PUBLIC (permitAll)
                        .requestMatchers("/auth/**").permitAll()
                        // Thêm quyền cho OAuth2 endpoint
                        .requestMatchers("/oauth2/**", "/login/**").permitAll()

                        .requestMatchers("/api/cart/**").permitAll()
                        .requestMatchers("/api/orders/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/categories/**", "/api/reviews/**").permitAll()

                        .requestMatchers("/api/**").permitAll()

                        // PHẦN USER (authenticated)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/api/locations/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/me").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/me").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users/me/addresses").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/me/password").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/me/addresses/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/me/addresses/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/users/me/addresses").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/reviews/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/cart/**", "/api/orders/**").hasAnyRole("USER", "ADMIN")

                        // PHẦN ADMIN
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers("/avatars/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/custom-products/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/products/**", "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**", "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**", "/api/categories/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                //  2. CẤU HÌNH OAUTH2 LOGIN
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(e -> e.baseUri("/oauth2/authorization"))
                        .redirectionEndpoint(e -> e.baseUri("/login/oauth2/code/*"))
                        .userInfoEndpoint(e -> e.userService(customOAuth2UserService)) // Service lưu user vào DB
                        .successHandler(oAuth2AuthenticationSuccessHandler) // Handler tạo JWT và redirect về React
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setUserDetailsService(myUserDetailsService);
        p.setPasswordEncoder(passwordEncoder());
        return p;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var conf = new CorsConfiguration();
        conf.setAllowCredentials(true);
        conf.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8080")); // Đảm bảo React port đúng
        conf.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        conf.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        var src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", conf);
        return src;
    }
}