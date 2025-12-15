# Tài liệu về DTO trong Mô hình MVC với Spring Framework

## 1. Giới thiệu về DTO

Trong mô hình MVC (Model-View-Controller), **DTO (Data Transfer Object)** là các lớp được thiết kế để truyền dữ liệu giữa các tầng của ứng dụng, đặc biệt là giữa **Controller** và client (như frontend hoặc API bên thứ ba) hoặc giữa các **Service**. DTO giúp kiểm soát dữ liệu được gửi đi và nhận về, tránh lộ cấu trúc của **Entity** và tối ưu hóa dữ liệu truyền tải.

Trong Spring Framework, DTO thường được sử dụng kết hợp với các annotation validation (như `@NotNull`, `@Size`) và các công cụ ánh xạ (như **MapStruct** hoặc **ModelMapper**) để chuyển đổi giữa DTO và Entity. DTO là một phần quan trọng trong việc xây dựng API sạch và an toàn.

## 2. Vai trò của DTO trong MVC

DTO trong Spring Framework có các vai trò chính sau:
- **Kiểm soát dữ liệu truyền tải**: Chỉ gửi các trường dữ liệu cần thiết đến client, tránh lộ các trường nhạy cảm của Entity (như mật khẩu hoặc thông tin nội bộ).
- **Tách biệt tầng dữ liệu**: Ngăn cách cấu trúc Entity (ánh xạ với cơ sở dữ liệu) khỏi dữ liệu được gửi qua API.
- **Validation dữ liệu**: Áp dụng các ràng buộc kiểm tra dữ liệu đầu vào/đầu ra bằng các annotation như `@NotNull`, `@Size`, hoặc `@Email`.
- **Tối ưu hóa hiệu suất**: Giảm kích thước dữ liệu truyền tải bằng cách chỉ bao gồm các trường cần thiết.
- **Tính linh hoạt**: Dễ dàng thay đổi cấu trúc dữ liệu API mà không ảnh hưởng đến Entity hoặc cơ sở dữ liệu.
- **Hỗ trợ API versioning**: DTO giúp định nghĩa các phiên bản khác nhau của API (ví dụ: `ProductDTOv1`, `ProductDTOv2`).

## 3. Tính năng của DTO

- **Tùy chỉnh dữ liệu**: Chỉ bao gồm các trường cần thiết, có thể thêm hoặc bỏ các trường mà không phụ thuộc vào Entity.
- **Validation mạnh mẽ**: Tích hợp với Bean Validation để kiểm tra dữ liệu đầu vào/đầu ra.
- **Dễ ánh xạ**: Sử dụng các thư viện như MapStruct hoặc ModelMapper để chuyển đổi giữa DTO và Entity.
- **Tính tái sử dụng**: Có thể sử dụng DTO cho nhiều endpoint hoặc API khác nhau.
- **Bảo mật**: Ngăn lộ các trường nhạy cảm của Entity (như `password`, `internalId`).
- **Hỗ trợ serialization/deserialization**: Tích hợp với Jackson để chuyển đổi thành JSON/XML.

## 4. Triển khai DTO trong Spring Framework

Trong Spring, DTO được triển khai dưới dạng các lớp Java đơn giản, thường chứa các thuộc tính, getter/setter, và các annotation validation. DTO được sử dụng trong Controller để nhận dữ liệu từ client hoặc trả về dữ liệu, và được ánh xạ với Entity trong Service.

### 4.1. Các annotation chính liên quan đến DTO

- **`@NotNull`, `@Size`, `@Email`, `@Min`, `@Max` (từ `javax.validation.constraints`)**: Áp dụng các ràng buộc kiểm tra dữ liệu.
- **`@Valid`**: Kích hoạt validation cho DTO trong Controller hoặc Service.
- **`@JsonProperty` (từ Jackson)**: Tùy chỉnh tên trường trong JSON.
- **`@JsonIgnore`**: Loại bỏ một trường khỏi JSON serialization.
- **`@JsonInclude`**: Kiểm soát việc bao gồm các trường null trong JSON.

### 4.2. Ví dụ triển khai DTO

Dưới đây là một ví dụ về DTO trong Spring Framework cho một ứng dụng thương mại điện tử, bao gồm DTO cho `Product` và `Order`, cùng với ánh xạ sử dụng **MapStruct**.

#### 4.2.1. DTO cho Product

```java
package com.example.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.validation.constraints.Min;

public class ProductDTO {

    @JsonProperty("product_id")
    private Long id;

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
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}
```

#### 4.2.2. DTO cho Order

```java
package com.example.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {

    @JsonProperty("order_id")
    private Long id;

    private Double totalAmount;

    private LocalDateTime createdAt;

    @NotEmpty(message = "Order items cannot be empty")
    private List<OrderItemDTO> orderItems;

    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<OrderItemDTO> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemDTO> orderItems) { this.orderItems = orderItems; }
}
```

```java
package com.example.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Min;

public class OrderItemDTO {

    private Long id;

    @NotNull(message = "Product ID cannot be null")
    private Long productId;

    @NotNull(message = "Quantity cannot be null")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
```

#### 4.2.3. Entity tương ứng

Để minh họa ánh xạ, đây là các Entity liên quan:

```java
package com.example.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 2, max = 100)
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "price")
    private Double price;

    @NotNull
    @Column(name = "stock")
    private Integer stock;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Product() {}

    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
```

```java
package com.example.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    public Order() {}

    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }
}
```

```java
package com.example.model;

import javax.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "quantity")
    private Integer quantity;

    public OrderItem() {}

    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
```

#### 4.2.4. Ánh xạ DTO với Entity (sử dụng MapStruct)

```java
package com.example.mapper;

import com.example.dto.OrderDTO;
import com.example.dto.OrderItemDTO;
import com.example.dto.ProductDTO;
import com.example.model.Order;
import com.example.model.OrderItem;
import com.example.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EntityMapper {

    @Mapping(source = "id", target = "product_id")
    ProductDTO toProductDTO(Product product);

    Product toProductEntity(ProductDTO productDTO);

    OrderDTO toOrderDTO(Order order);

    @Mapping(source = "productId", target = "product.id")
    OrderItem toOrderItemEntity(OrderItemDTO orderItemDTO);

    @Mapping(source = "product.id", target = "productId")
    OrderItemDTO toOrderItemDTO(OrderItem orderItem);
}
```

#### 4.2.5. Service sử dụng DTO

```java
package com.example.service;

import com.example.dto.ProductDTO;
import com.example.mapper.EntityMapper;
import com.example.model.Product;
import com.example.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Validated
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final EntityMapper entityMapper;

    public ProductService(ProductRepository productRepository, EntityMapper entityMapper) {
        this.productRepository = productRepository;
        this.entityMapper = entityMapper;
    }

    public List<ProductDTO> findAllProducts() {
        return productRepository.findAll().stream()
                .map(entityMapper::toProductDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = false)
    public ProductDTO createProduct(@Valid ProductDTO productDTO) {
        Product product = entityMapper.toProductEntity(productDTO);
        product.setCreatedAt(LocalDateTime.now());
        Product savedProduct = productRepository.save(product);
        return entityMapper.toProductDTO(savedProduct);
    }
}
```

#### 4.2.6. Controller sử dụng DTO

```java
package com.example.controller;

import com.example.dto.ProductDTO;
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

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.findAllProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO savedProduct = productService.createProduct(productDTO);
        return ResponseEntity.status(201).body(savedProduct);
    }
}
```

#### Giải thích ví dụ
- **DTO (`ProductDTO`, `OrderDTO`, `OrderItemDTO`)**: Chỉ chứa các trường cần thiết, sử dụng `@JsonProperty` để tùy chỉnh tên JSON, và `@NotNull`, `@Size`, `@Min` để validation.
- **MapStruct**: Được sử dụng để ánh xạ giữa DTO và Entity, giảm mã boilerplate.
- **Service**: Chuyển đổi DTO thành Entity trước khi lưu và ngược lại khi trả về dữ liệu.
- **Controller**: Nhận và trả về DTO, sử dụng `@Valid` để kiểm tra dữ liệu đầu vào.
- **Validation**: Kết hợp Bean Validation (`@NotNull`, `@Size`) để đảm bảo dữ liệu hợp lệ.

### 4.3. Cấu hình MapStruct

Thêm dependency trong `pom.xml`:

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.5.5.Final</version>
    <scope>provided</scope>
</dependency>
```

## 5. Các lưu ý khi coding DTO trong Spring

- **Chỉ bao gồm các trường cần thiết**: Tránh sao chép toàn bộ Entity để giảm kích thước dữ liệu truyền tải.
- **Validation**: Sử dụng các annotation như `@NotNull`, `@Size`, `@Email` để kiểm tra dữ liệu đầu vào.
- **Ánh xạ tự động**: Sử dụng MapStruct hoặc ModelMapper để giảm mã boilerplate khi chuyển đổi DTO ↔ Entity.
- **Tên trường trong JSON**: Sử dụng `@JsonProperty` để đảm bảo tên trường trong JSON phù hợp với yêu cầu client.
- **Bảo mật**: Không bao gồm các trường nhạy cảm (như `password`, `internalId`) trong DTO.
- **Versioning**: Tạo các DTO riêng cho từng phiên bản API (ví dụ: `ProductDTOv1`, `ProductDTOv2`) nếu cần hỗ trợ API versioning.
- **Testing**: Viết unit test để kiểm tra ánh xạ và validation của DTO.

### 5.1. Unit Test cho DTO và Ánh xạ

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class EntityMapperTest {

    @Autowired
    private EntityMapper entityMapper;

    @Test
    void testProductToDTO() {
        Product product = new Product("Laptop", 1000.0, 10, LocalDateTime.now());
        product.setId(1L);

        ProductDTO productDTO = entityMapper.toProductDTO(product);

        assertThat(productDTO.getId()).isEqualTo(1L);
        assertThat(productDTO.getName()).isEqualTo("Laptop");
        assertThat(productDTO.getPrice()).isEqualTo(1000.0);
        assertThat(productDTO.getStock()).isEqualTo(10);
    }
}
```

## 6. Lợi ích của DTO trong Spring MVC

- **Bảo mật**: Ngăn lộ cấu trúc Entity và các trường nhạy cảm.
- **Tối ưu hóa**: Giảm kích thước dữ liệu truyền tải bằng cách chỉ gửi các trường cần thiết.
- **Tính linh hoạt**: Dễ dàng thay đổi cấu trúc API mà không ảnh hưởng đến Entity.
- **Validation mạnh mẽ**: Đảm bảo dữ liệu đầu vào hợp lệ trước khi xử lý.
- **Tái sử dụng**: DTO có thể được sử dụng cho nhiều endpoint hoặc API.
- **Hỗ trợ API versioning**: Dễ dàng tạo các DTO khác nhau cho các phiên bản API.

## 7. Thách thức khi sử dụng DTO

- **Boilerplate code**: Việc tạo DTO và ánh xạ có thể tạo ra nhiều mã lặp lại (giải quyết bằng MapStruct/ModelMapper).
- **Bảo trì**: Nhiều DTO có thể gây khó khăn trong việc quản lý, đặc biệt khi Entity thay đổi.
- **Validation phức tạp**: Cần đảm bảo validation được áp dụng đúng cho cả DTO và Entity.
- **Performance**: Ánh xạ DTO ↔ Entity có thể gây overhead nhỏ nếu không tối ưu.

## 8. Kết luận

DTO là một thành phần quan trọng trong mô hình MVC với Spring Framework, giúp kiểm soát dữ liệu truyền tải, tăng bảo mật, và tách biệt tầng dữ liệu khỏi API. Với các annotation validation (`@NotNull`, `@Size`) và các công cụ ánh xạ như MapStruct, DTO cung cấp một cách tiếp cận sạch và hiệu quả để xây dựng API.

Khi triển khai DTO, cần chú ý:
- Chỉ bao gồm các trường cần thiết trong DTO.
- Sử dụng validation để đảm bảo dữ liệu hợp lệ.
- Tận dụng MapStruct hoặc ModelMapper để ánh xạ DTO ↔ Entity.
- Đảm bảo bảo mật bằng cách loại bỏ các trường nhạy cảm.
- Viết unit test để kiểm tra ánh xạ và validation.

DTO giúp xây dựng một backend **clean**, **secure**, và **maintainable**, là nền tảng cho các API RESTful chất lượng cao trong các ứng dụng enterprise.

Nếu bạn cần thêm ví dụ cụ thể về DTO cho các trường hợp phức tạp (như nested DTO, API versioning, hoặc integration test), hãy yêu cầu thêm thông tin!