# Tài liệu về Exception Handling trong Mô hình MVC với Spring Framework

## 1. Giới thiệu về Exception Handling

Trong mô hình MVC (Model-View-Controller) với **Spring Framework**, **Exception Handling (Xử lý ngoại lệ)** là một thành phần quan trọng để đảm bảo ứng dụng hoạt động ổn định, trả về các phản hồi lỗi thân thiện với người dùng, và duy trì tính bảo trì của mã nguồn. Spring cung cấp các cơ chế mạnh mẽ để xử lý ngoại lệ một cách tập trung, đặc biệt thông qua annotation `@ControllerAdvice` và `@ExceptionHandler`, giúp xử lý các ngoại lệ phát sinh từ Controller, Service, hoặc Repository.

Exception Handling giúp ứng dụng trả về các mã trạng thái HTTP phù hợp (như 400, 404, 500) và thông điệp lỗi rõ ràng, đồng thời ghi log để hỗ trợ debug và giám sát.

## 2. Vai trò của Exception Handling trong MVC

Exception Handling trong Spring Framework có các vai trò chính sau:
- **Xử lý lỗi tập trung**: Xử lý tất cả các ngoại lệ tại một nơi duy nhất thay vì rải rác trong mã nguồn.
- **Trả về phản hồi thân thiện**: Chuyển đổi các ngoại lệ thành các phản hồi HTTP với mã trạng thái và thông điệp lỗi rõ ràng.
- **Ghi log lỗi**: Lưu trữ thông tin lỗi để hỗ trợ debug và giám sát.
- **Bảo mật**: Ẩn chi tiết lỗi nhạy cảm (như stack trace) khỏi client.
- **Tăng trải nghiệm người dùng**: Cung cấp thông điệp lỗi dễ hiểu thay vì lỗi mặc định của hệ thống.
- **Hỗ trợ API REST**: Trả về JSON/XML chứa thông tin lỗi cho các API REST.

## 3. Tính năng của Exception Handling

- **Tập trung hóa**: Sử dụng `@ControllerAdvice` để xử lý ngoại lệ toàn cục.
- **Tùy chỉnh phản hồi**: Trả về các mã trạng thái HTTP (như 400, 404, 500) và thông điệp lỗi tùy chỉnh.
- **Hỗ trợ nhiều loại ngoại lệ**: Xử lý các ngoại lệ cụ thể (như `BusinessException`) hoặc tổng quát (như `Exception`).
- **Validation lỗi**: Xử lý lỗi từ Bean Validation (`@Valid`) hoặc các ràng buộc tùy chỉnh.
- **Logging tích hợp**: Kết hợp với SLF4J/Logback để ghi log chi tiết lỗi.
- **Tích hợp với Spring MVC**: Hoạt động tốt với Controller và REST API.
- **Hỗ trợ đa ngôn ngữ**: Có thể trả về thông điệp lỗi theo ngôn ngữ của người dùng.

## 4. Triển khai Exception Handling trong Spring Framework

Trong Spring, Exception Handling được triển khai chủ yếu qua `@ControllerAdvice` và `@ExceptionHandler`. Các ngoại lệ có thể được xử lý ở mức toàn cục (global) hoặc cục bộ (trong Controller cụ thể). Spring cũng hỗ trợ xử lý lỗi validation và tích hợp với logging.

### 4.1. Các annotation và lớp chính

- **`@ControllerAdvice`**: Định nghĩa một lớp xử lý ngoại lệ toàn cục cho tất cả các Controller.
- **`@ExceptionHandler`**: Xác định phương thức xử lý một loại ngoại lệ cụ thể.
- **`@ResponseStatus`**: Chỉ định mã trạng thái HTTP cho phản hồi lỗi.
- **`ResponseEntity`**: Tùy chỉnh phản hồi HTTP với mã trạng thái và nội dung.
- **`MethodArgumentNotValidException`**: Xử lý lỗi validation từ `@Valid`.
- **`BindException`**: Xử lý lỗi binding dữ liệu từ request.

### 4.2. Ví dụ triển khai Exception Handling

Dưới đây là một ví dụ về Exception Handling trong một ứng dụng thương mại điện tử, bao gồm xử lý ngoại lệ nghiệp vụ, validation, và lỗi tổng quát.

#### 4.2.1. Lớp ngoại lệ tùy chỉnh (BusinessException)

```java
package com.example.exception;

public class BusinessException extends RuntimeException {

    private final String errorCode;

    public BusinessException(String message) {
        super(message);
        this.errorCode = "GENERIC_ERROR";
    }

    public BusinessException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
```

#### 4.2.2. Lớp phản hồi lỗi (ErrorResponse)

```java
package com.example.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private int status;
    private String errorCode;
    private String message;
    private String details;

    public ErrorResponse(int status, String errorCode, String message) {
        this.status = status;
        this.errorCode = errorCode;
        this.message = message;
    }

    public ErrorResponse(int status, String errorCode, String message, String details) {
        this.status = status;
        this.errorCode = errorCode;
        this.message = message;
        this.details = details;
    }

    // Getters và Setters
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
```

#### 4.2.3. Global Exception Handler

```java
package com.example.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Xử lý ngoại lệ nghiệp vụ
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
        logger.error("Business error: {} - Code: {}", ex.getMessage(), ex.getErrorCode());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getErrorCode(),
                ex.getMessage()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Xử lý lỗi validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        logger.warn("Validation error: {}", ex.getMessage());

        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "VALIDATION_ERROR",
                "Validation failed",
                errors.toString()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Xử lý lỗi tổng quát
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        logger.error("Unexpected error: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "INTERNAL_SERVER_ERROR",
                "An unexpected error occurred"
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Xử lý lỗi không tìm thấy tài nguyên
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        logger.warn("Resource not found: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "RESOURCE_NOT_FOUND",
                ex.getMessage()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
```

#### 4.2.4. Ngoại lệ không tìm thấy tài nguyên

```java
package com.example.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

#### 4.2.5. Sử dụng trong Service

```java
package com.example.service;

import com.example.exception.BusinessException;
import com.example.exception.ResourceNotFoundException;
import com.example.model.Product;
import com.example.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Transactional(readOnly = false)
    public Product createProduct(Product product) {
        if (product.getPrice() <= 0) {
            throw new BusinessException("Price must be greater than 0", "INVALID_PRICE");
        }
        return productRepository.save(product);
    }

    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }
}
```

#### 4.2.6. Sử dụng trong Controller

```java
package com.example.controller;

import com.example.dto.ProductDTO;
import com.example.model.Product;
import com.example.service.ProductService;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.findProductById(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setStock(productDTO.getStock());
        Product savedProduct = productService.createProduct(product);
        return ResponseEntity.status(201).body(savedProduct);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.findAllProducts();
        return ResponseEntity.ok(products);
    }
}
```

#### 4.2.7. DTO với Validation

```java
package com.example.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class ProductDTO {

    @NotNull(message = "Name cannot be null")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotNull(message = "Price cannot be null")
    @Min(value = 0, message = "Price must be greater than or equal to 0")
    private Double price;

    @NotNull(message = "Stock cannot be null")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    // Getters và Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}
```

#### 4.2.8. Cấu hình Logging trong `application.yml`

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
logging:
  level:
    com.example: DEBUG
    org.springframework: INFO
```

#### Giải thích ví dụ
- **`BusinessException`**: Ngoại lệ tùy chỉnh cho các lỗi nghiệp vụ, kèm mã lỗi (`errorCode`) để dễ phân loại.
- **`ResourceNotFoundException`**: Ngoại lệ cho các trường hợp tài nguyên không tìm thấy (404).
- **`ErrorResponse`**: Đối tượng phản hồi lỗi với các trường như mã trạng thái, mã lỗi, và thông điệp.
- **`GlobalExceptionHandler`**: Xử lý các ngoại lệ toàn cục, bao gồm lỗi nghiệp vụ, validation, và lỗi tổng quát.
- **Logging**: Sử dụng SLF4J để ghi log lỗi, giúp debug và giám sát.
- **Service và Controller**: Ném ngoại lệ cụ thể (`BusinessException`, `ResourceNotFoundException`) để được xử lý bởi `GlobalExceptionHandler`.
- **Validation**: Kết hợp `@Valid` trong Controller để xử lý lỗi validation từ DTO.

### 4.3. Cấu hình Logging (Logback)

File `logback-spring.xml`:

```xml
<configuration>
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <logger name="com.example" level="DEBUG" additivity="false">
        <appender-ref ref="CONSOLE" />
    </logger>

    <root level="INFO">
        <appender-ref ref="CONSOLE" />
    </root>
</configuration>
```

### 4.4. Thêm dependency trong `pom.xml`

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>
```

## 5. Các lưu ý khi coding Exception Handling trong Spring

- **Tập trung hóa xử lý**: Sử dụng `@ControllerAdvice` để xử lý ngoại lệ toàn cục, tránh lặp mã trong từng Controller.
- **Ngoại lệ tùy chỉnh**: Tạo các lớp ngoại lệ như `BusinessException` hoặc `ResourceNotFoundException` để xử lý lỗi cụ thể.
- **Phản hồi lỗi rõ ràng**: Sử dụng `ErrorResponse` để trả về thông tin lỗi với mã trạng thái, mã lỗi, và thông điệp.
- **Logging**: Ghi log chi tiết lỗi với mức độ phù hợp (`DEBUG`, `WARN`, `ERROR`) để hỗ trợ debug.
- **Bảo mật**: Ẩn stack trace hoặc thông tin nhạy cảm khỏi phản hồi gửi đến client.
- **Validation**: Xử lý lỗi từ `@Valid` một cách riêng biệt để cung cấp thông tin chi tiết về trường lỗi.
- **Testing**: Viết unit test và integration test để kiểm tra xử lý ngoại lệ.

### 5.1. Unit Test cho Exception Handling

```java
import com.example.exception.BusinessException;
import com.example.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ExceptionHandlingTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testBusinessException() throws Exception {
        mockMvc.perform(post("/api/products")
                .contentType("application/json")
                .content("{\"name\": \"Laptop\", \"price\": -1, \"stock\": 10}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("INVALID_PRICE"))
                .andExpect(jsonPath("$.message").value("Price must be greater than 0"));
    }

    @Test
    void testValidationException() throws Exception {
        mockMvc.perform(post("/api/products")
                .contentType("application/json")
                .content("{\"name\": \"\", \"price\": 100, \"stock\": 10}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }
}
```

## 6. Lợi ích của Exception Handling trong Spring MVC

- **Tập trung hóa**: Xử lý lỗi ở một nơi duy nhất, giảm lặp mã.
- **Phản hồi thân thiện**: Trả về thông điệp lỗi rõ ràng, dễ hiểu cho client.
- **Bảo mật**: Ẩn thông tin nhạy cảm khỏi phản hồi.
- **Logging hiệu quả**: Ghi log chi tiết để hỗ trợ debug và giám sát.
- **Tích hợp với validation**: Xử lý lỗi từ `@Valid` một cách mượt mà.
- **Tính mở rộng**: Dễ dàng thêm xử lý cho các loại ngoại lệ mới.

## 7. Thách thức khi sử dụng Exception Handling

- **Phức tạp cấu hình**: Cần hiểu rõ các loại ngoại lệ và cách xử lý phù hợp.
- **Logging quá tải**: Ghi log quá nhiều có thể làm chậm ứng dụng nếu không tối ưu.
- **Phản hồi lỗi không nhất quán**: Nếu không chuẩn hóa `ErrorResponse`, client có thể nhận được các định dạng lỗi khác nhau.
- **Testing**: Cần kiểm tra tất cả các trường hợp ngoại lệ, bao gồm validation và lỗi nghiệp vụ.
- **Bảo trì**: Khi thêm ngoại lệ mới, cần cập nhật `GlobalExceptionHandler`.

## 8. Kết luận

Exception Handling là một thành phần quan trọng trong Spring Framework, giúp xử lý các lỗi phát sinh trong ứng dụng MVC một cách tập trung và hiệu quả. Với `@ControllerAdvice`, `@ExceptionHandler`, và các lớp ngoại lệ tùy chỉnh như `BusinessException`, Spring cung cấp một cách tiếp cận mạnh mẽ để đảm bảo ứng dụng ổn định, thân thiện với người dùng, và dễ bảo trì.

Khi triển khai Exception Handling, cần chú ý:
- Sử dụng `@ControllerAdvice` để xử lý lỗi toàn cục.
- Tạo các ngoại lệ tùy chỉnh cho lỗi nghiệp vụ và tài nguyên không tìm thấy.
- Chuẩn hóa phản hồi lỗi với `ErrorResponse`.
- Ghi log chi tiết nhưng tối ưu để tránh ảnh hưởng hiệu suất.
- Viết test để kiểm tra xử lý ngoại lệ.
- Ẩn thông tin nhạy cảm khỏi client để tăng bảo mật.

Exception Handling giúp xây dựng một backend **stable**, **user-friendly**, và **secure**, là nền tảng cho các ứng dụng enterprise chất lượng cao.

Nếu bạn cần thêm ví dụ cụ thể về xử lý ngoại lệ trong các trường hợp nâng cao (như tích hợp với i18n cho thông điệp lỗi đa ngôn ngữ, hoặc xử lý lỗi với OAuth2), hãy yêu cầu thêm thông tin!