# Tài liệu về Security Configuration trong Mô hình MVC với Spring Framework

## 1. Giới thiệu về Security Configuration

Trong mô hình MVC (Model-View-Controller) với **Spring Framework**, **Security Configuration (Cấu hình bảo mật)** là thành phần quan trọng để đảm bảo an toàn cho ứng dụng thông qua xác thực (authentication) và phân quyền (authorization). Spring Security là một module mạnh mẽ của Spring, cung cấp các công cụ để bảo vệ các endpoint, quản lý người dùng, và tích hợp với các giao thức như Basic Authentication, JWT, hoặc OAuth2.

Security Configuration được triển khai thông qua các lớp Java sử dụng annotation `@Configuration` và `@EnableWebSecurity`, cùng với các cấu hình liên quan trong file `application.properties` hoặc `application.yml`. Nó giúp bảo vệ ứng dụng khỏi các truy cập không được phép, quản lý vai trò (roles), và xử lý các yêu cầu bảo mật như mã hóa mật khẩu hoặc CSRF.

## 2. Vai trò của Security Configuration trong MVC

Security Configuration trong Spring Framework có các vai trò chính sau:
- **Xác thực (Authentication)**: Xác minh danh tính người dùng thông qua thông tin đăng nhập (username/password, token, v.v.).
- **Phân quyền (Authorization)**: Quy định quyền truy cập vào các tài nguyên (endpoint, phương thức) dựa trên vai trò hoặc quyền của người dùng.
- **Bảo vệ endpoint**: Hạn chế truy cập vào các endpoint dựa trên vai trò hoặc trạng thái xác thực.
- **Mã hóa mật khẩu**: Sử dụng các thuật toán như BCrypt để mã hóa mật khẩu người dùng.
- **Tích hợp giao thức bảo mật**: Hỗ trợ các giao thức như JWT, OAuth2, hoặc Basic Authentication.
- **Quản lý phiên (Session Management)**: Kiểm soát phiên đăng nhập, thời gian hết hạn, hoặc đăng xuất.
- **Bảo vệ chống tấn công**: Ngăn chặn các cuộc tấn công như CSRF, XSS, hoặc SQL Injection.

## 3. Tính năng của Security Configuration

- **Xác thực linh hoạt**: Hỗ trợ nhiều phương thức xác thực (in-memory, database, LDAP, OAuth2, JWT).
- **Phân quyền chi tiết**: Sử dụng `@PreAuthorize`, `@Secured`, hoặc cấu hình dựa trên URL để kiểm soát truy cập.
- **Mã hóa mạnh mẽ**: Tích hợp BCrypt, Argon2, hoặc các thuật toán mã hóa khác.
- **Tích hợp với Spring MVC**: Bảo vệ các Controller và endpoint REST API.
- **Hỗ trợ CSRF**: Bật/tắt bảo vệ CSRF cho các API REST.
- **Quản lý người dùng**: Quản lý thông tin người dùng và vai trò thông qua `UserDetailsService`.
- **Tùy chỉnh lỗi bảo mật**: Xử lý các lỗi như đăng nhập thất bại hoặc truy cập trái phép.

## 4. Triển khai Security Configuration trong Spring Framework

Trong Spring, Security Configuration được triển khai thông qua lớp cấu hình sử dụng annotation `@EnableWebSecurity` và các Bean liên quan. Spring Security cung cấp các tính năng như `SecurityFilterChain` để cấu hình bảo mật, `UserDetailsService` để quản lý người dùng, và `PasswordEncoder` để mã hóa mật khẩu.

### 4.1. Các annotation và lớp chính của Spring Security

- **`@EnableWebSecurity`**: Bật tính năng bảo mật của Spring Security.
- **`@Configuration`**: Đánh dấu lớp cấu hình bảo mật.
- **`@Bean`**: Định nghĩa các Bean như `SecurityFilterChain`, `UserDetailsService`, hoặc `PasswordEncoder`.
- **`@PreAuthorize`, `@Secured`**: Kiểm soát quyền truy cập tại mức phương thức.
- **`@AuthenticationPrincipal`**: Truy xuất thông tin người dùng đã xác thực trong Controller.
- **`SecurityFilterChain`**: Cấu hình các quy tắc bảo mật cho ứng dụng.
- **`UserDetailsService`**: Cung cấp thông tin người dùng từ cơ sở dữ liệu hoặc in-memory.
- **`PasswordEncoder`**: Mã hóa và so sánh mật khẩu.

### 4.2. Ví dụ triển khai Security Configuration

Dưới đây là một ví dụ về Security Configuration trong một ứng dụng thương mại điện tử, bao gồm xác thực dựa trên cơ sở dữ liệu, phân quyền dựa trên vai trò, và bảo vệ endpoint.

#### 4.2.1. Cấu hình Spring Security

```java
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Cấu hình quyền truy cập cho các endpoint
            .authorizeHttpRequests((requests) -> requests
                .requestMatchers("/api/public/**").permitAll() // Cho phép truy cập không cần xác thực
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // Chỉ admin truy cập
                .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN") // User hoặc admin truy cập
                .anyRequest().authenticated() // Các request khác cần xác thực
            )
            // Sử dụng HTTP Basic Authentication
            .httpBasic()
            // Tắt CSRF cho API REST
            .and()
            .csrf().disable()
            // Cấu hình đăng xuất
            .logout()
            .logoutUrl("/api/logout")
            .logoutSuccessUrl("/api/public/login?logout=true")
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID");

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // Sử dụng CustomUserDetailsService để lấy thông tin người dùng từ cơ sở dữ liệu
        return new CustomUserDetailsService();
    }
}
```

#### 4.2.2. Custom UserDetailsService (Lấy thông tin người dùng từ cơ sở dữ liệu)

```java
package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }
}
```

#### 4.2.3. Entity User

```java
package com.example.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(unique = true)
    private String username;

    @NotNull
    private String password;

    @NotNull
    private String role; // Ví dụ: "USER", "ADMIN"

    public User() {}

    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
```

#### 4.2.4. Repository cho User

```java
package com.example.repository;

import com.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
```

#### 4.2.5. Service để tạo User với mật khẩu mã hóa

```java
package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(String username, String rawPassword, String role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        return userRepository.save(user);
    }
}
```

#### 4.2.6. Controller sử dụng thông tin người dùng đã xác thực

```java
package com.example.controller;

import com.example.dto.ProductDTO;
import com.example.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(@AuthenticationPrincipal UserDetails userDetails) {
        // Lấy thông tin người dùng đã xác thực
        String username = userDetails.getUsername();
        System.out.println("Authenticated user: " + username);

        List<ProductDTO> products = productService.findAllProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO savedProduct = productService.createProduct(productDTO);
        return ResponseEntity.status(201).body(savedProduct);
    }
}
```

#### 4.2.7. Cấu hình trong `application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ecommerce
    username: root
    password: password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

#### Giải thích ví dụ
- **`SecurityConfig`**: Cấu hình bảo mật với `SecurityFilterChain` để bảo vệ endpoint, sử dụng HTTP Basic Authentication, tắt CSRF (phù hợp với API REST), và cấu hình đăng xuất.
- **`CustomUserDetailsService`**: Lấy thông tin người dùng từ cơ sở dữ liệu thông qua `UserRepository`.
- **`PasswordEncoder`**: Sử dụng BCrypt để mã hóa mật khẩu.
- **`UserService`**: Tạo người dùng với mật khẩu đã mã hóa.
- **Controller**: Sử dụng `@AuthenticationPrincipal` để truy xuất thông tin người dùng đã xác thực và `@PreAuthorize` để kiểm tra quyền admin.
- **Entity và Repository**: Lưu trữ thông tin người dùng trong cơ sở dữ liệu.

### 4.3. Tích hợp JWT (Tùy chọn nâng cao)

Nếu muốn sử dụng JWT thay vì HTTP Basic Authentication, cần thêm filter và cấu hình bổ sung:

```java
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests((requests) -> requests
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .csrf().disable();

        return http.build();
    }
}
```

#### JWT Filter (Ví dụ)

```java
package com.example.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            // Xác thực token (giả lập)
            // Đặt Authentication vào SecurityContext
            // SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }
}
```

## 5. Các lưu ý khi coding Security Configuration trong Spring

- **Chọn phương thức xác thực phù hợp**:
  - HTTP Basic: Phù hợp cho ứng dụng đơn giản.
  - JWT: Phù hợp cho API REST stateless.
  - OAuth2: Phù hợp cho tích hợp với bên thứ ba.
- **Mã hóa mật khẩu**: Luôn sử dụng `PasswordEncoder` (như BCrypt) để mã hóa mật khẩu.
- **Tắt CSRF khi cần**: CSRF thường được tắt cho API REST, nhưng cần bật cho ứng dụng web truyền thống.
- **Phân quyền chi tiết**:
  - Sử dụng `hasRole`, `hasAnyRole` trong `SecurityFilterChain` hoặc `@PreAuthorize` trong phương thức.
  - Định nghĩa vai trò rõ ràng (như `ROLE_USER`, `ROLE_ADMIN`).
- **Logging**: Ghi log các sự kiện bảo mật (đăng nhập, đăng xuất, lỗi xác thực).
- **Testing**: Viết test để kiểm tra xác thực và phân quyền.
- **Cập nhật thư viện**: Đảm bảo sử dụng phiên bản mới nhất của Spring Security để tránh lỗ hổng bảo mật.

### 5.1. Unit Test cho Security

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "USER")
    void testUserAccess() throws Exception {
        mockMvc.perform(get("/api/user"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    void testUserAccessAdminEndpoint() throws Exception {
        mockMvc.perform(get("/api/admin"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAdminAccess() throws Exception {
        mockMvc.perform(get("/api/admin"))
                .andExpect(status().isOk());
    }
}
```

### 5.2. Thêm dependency trong `pom.xml`

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

## 6. Lợi ích của Security Configuration trong Spring MVC

- **Bảo mật cao**: Bảo vệ ứng dụng khỏi truy cập trái phép và các cuộc tấn công phổ biến.
- **Tính linh hoạt**: Hỗ trợ nhiều phương thức xác thực (Basic, JWT, OAuth2).
- **Phân quyền chi tiết**: Kiểm soát truy cập dựa trên vai trò hoặc quyền.
- **Tích hợp dễ dàng**: Hoạt động tốt với Spring MVC, REST API, và các module khác.
- **Mã hóa mạnh mẽ**: Sử dụng các thuật toán như BCrypt để bảo vệ mật khẩu.
- **Quản lý phiên**: Kiểm soát phiên đăng nhập và đăng xuất hiệu quả.

## 7. Thách thức khi sử dụng Security Configuration

- **Phức tạp cấu hình**: Spring Security có nhiều tùy chọn, dễ gây nhầm lẫn cho người mới.
- **Hiệu suất**: Cấu hình không tối ưu (như lưu phiên không cần thiết) có thể ảnh hưởng hiệu suất.
- **Tích hợp JWT/OAuth2**: Yêu cầu thêm filter và logic xử lý token.
- **Debug khó khăn**: Lỗi bảo mật (như sai vai trò) cần logging tốt để phát hiện.
- **Bảo trì**: Cần cập nhật thường xuyên để tránh lỗ hổng bảo mật.

## 8. Kết luận

Security Configuration là một thành phần cốt lõi trong Spring Framework, đảm bảo ứng dụng MVC được bảo vệ khỏi các truy cập không được phép và các mối đe dọa bảo mật. Với các annotation như `@EnableWebSecurity`, `@PreAuthorize`, và các lớp như `SecurityFilterChain`, Spring Security cung cấp một cách tiếp cận mạnh mẽ để quản lý xác thực và phân quyền.

Khi triển khai Security Configuration, cần chú ý:
- Chọn phương thức xác thực phù hợp (Basic, JWT, OAuth2).
- Sử dụng `PasswordEncoder` để mã hóa mật khẩu.
- Phân quyền chi tiết với `hasRole` hoặc `@PreAuthorize`.
- Tắt CSRF cho API REST nếu cần.
- Viết test để kiểm tra bảo mật.
- Cập nhật thư viện Spring Security để tránh lỗ hổng.

Security Configuration giúp xây dựng một backend **secure**, **scalable**, và **maintainable**, là nền tảng cho các ứng dụng enterprise an toàn.

Nếu bạn cần thêm ví dụ cụ thể về tích hợp JWT, OAuth2, hoặc cấu hình bảo mật cho ứng dụng web truyền thống, hãy yêu cầu thêm thông tin!