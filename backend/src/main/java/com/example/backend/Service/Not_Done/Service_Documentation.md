# Tài liệu về Service trong Mô hình MVC với Spring Framework

## 1. Giới thiệu về Service

Trong mô hình MVC (Model-View-Controller), **Service** là thành phần thuộc tầng **Model**, chịu trách nhiệm xử lý **logic nghiệp vụ** của ứng dụng. Service đóng vai trò trung gian giữa **Controller** (xử lý yêu cầu HTTP) và **Repository** (truy cập dữ liệu), đảm bảo các quy tắc kinh doanh được áp dụng đúng cách và dữ liệu được xử lý nhất quán.

Trong Spring Framework, Service được đánh dấu bằng annotation `@Service` và thường sử dụng **Dependency Injection** để tương tác với các Repository hoặc các Service khác. Đây là nơi tập trung các quy tắc nghiệp vụ, validation dữ liệu, và các thao tác phức tạp liên quan đến dữ liệu.

## 2. Vai trò của Service trong MVC

Service trong Spring Framework có các vai trò chính sau:
- **Xử lý logic nghiệp vụ**: Thực hiện các quy tắc kinh doanh như tính toán giá, kiểm tra quyền truy cập, hoặc xử lý quy trình đặt hàng.
- **Phối hợp dữ liệu**: Gọi nhiều Repository để lấy hoặc kết hợp dữ liệu từ nhiều nguồn.
- **Kiểm tra dữ liệu (Validation)**: Đảm bảo dữ liệu đầu vào hợp lệ trước khi lưu vào cơ sở dữ liệu.
- **Quản lý giao dịch (Transaction Management)**: Sử dụng `@Transactional` để đảm bảo tính nhất quán của dữ liệu qua nhiều thao tác.
- **Tái sử dụng logic**: Cung cấp các phương thức có thể được gọi từ nhiều Controller hoặc Service khác.
- **Tách biệt trách nhiệm**: Giữ Controller chỉ xử lý yêu cầu HTTP, Repository chỉ truy cập dữ liệu, và Service chứa logic nghiệp vụ.

## 3. Tính năng của Service

- **Logic nghiệp vụ tập trung**: Tất cả quy tắc kinh doanh được đặt trong Service, giúp dễ bảo trì và kiểm thử.
- **Quản lý giao dịch**: Sử dụng `@Transactional` để đảm bảo các thao tác được thực hiện nguyên tử (atomic).
- **Dependency Injection**: Tiêm các Repository và Service khác thông qua `@Autowired` hoặc constructor injection.
- **Xử lý ngoại lệ nghiệp vụ**: Ném các exception tùy chỉnh để xử lý các lỗi liên quan đến quy tắc kinh doanh.
- **Caching**: Tích hợp Spring Cache để tối ưu hiệu suất cho các thao tác truy xuất dữ liệu thường xuyên.
- **Validation**: Kết hợp Bean Validation (`@Valid`) hoặc validation tùy chỉnh.
- **Event Handling**: Phát ra các sự kiện (events) để thông báo cho các thành phần khác trong ứng dụng.
- **Asynchronous Processing**: Hỗ trợ thực thi bất đồng bộ với `@Async`.

## 4. Triển khai Service trong Spring Framework

Trong Spring, Service được triển khai bằng cách sử dụng annotation `@Service` và các annotation liên quan đến giao dịch, validation, và caching. Service thường gọi Repository để truy xuất dữ liệu và thực hiện các quy tắc nghiệp vụ trước khi trả kết quả cho Controller.

### 4.1. Các annotation chính của Spring Service

- **`@Service`**: Đánh dấu một lớp là Service component, được Spring quản lý như một Bean.
- **`@Transactional`**: Quản lý giao dịch cho các phương thức, đảm bảo tính nhất quán dữ liệu.
- **`@Autowired`**: Tiêm phụ thuộc (Repository, Service khác) vào Service.
- **`@Valid`**: Kích hoạt validation cho các đối tượng đầu vào.
- **`@Cacheable`, `@CacheEvict`, `@CachePut`**: Tích hợp caching để tối ưu hiệu suất.
- **`@EventListener`**: Xử lý các sự kiện được phát ra trong ứng dụng.
- **`@Async`**: Thực thi phương thức bất đồng bộ.

### 4.2. Ví dụ triển khai Service

Dưới đây là một ví dụ về Service trong Spring Framework để quản lý Entity `Product` và `Order` trong một ứng dụng thương mại điện tử. Service này bao gồm logic nghiệp vụ như tạo sản phẩm, cập nhật tồn kho, tính giá giảm giá, và xử lý đơn hàng.

```java
package com.example.service;

import com.example.model.Order;
import com.example.model.OrderItem;
import com.example.model.Product;
import com.example.repository.OrderRepository;
import com.example.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Validated
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final OrderService orderService;

    // Constructor injection (khuyến nghị)
    @Autowired
    public ProductService(ProductRepository productRepository, OrderService orderService) {
        this.productRepository = productRepository;
        this.orderService = orderService;
    }

    // Lấy tất cả sản phẩm (sử dụng cache)
    @Cacheable(value = "products", key = "#root.methodName")
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    // Lấy sản phẩm theo ID
    public Optional<Product> findProductById(Long id) {
        return productRepository.findById(id);
    }

    // Tìm sản phẩm theo tên
    public List<Product> findProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    // Tìm sản phẩm theo khoảng giá
    public List<Product> findProductsByPriceRange(Double minPrice, Double maxPrice) {
        return productRepository.findProductsByPriceRange(minPrice, maxPrice);
    }

    // Lưu sản phẩm mới
    @Transactional(readOnly = false)
    @CacheEvict(value = "products", allEntries = true)
    public Product createProduct(@Valid Product product) {
        // Validation nghiệp vụ
        validateProductPrice(product.getPrice());
        validateProductStock(product.getStock());

        product.setCreatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    // Cập nhật sản phẩm
    @Transactional(readOnly = false)
    @CacheEvict(value = "products", key = "#id")
    public Product updateProduct(Long id, @Valid Product productDetails) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Product not found with id: " + id));

        // Áp dụng logic nghiệp vụ
        existingProduct.setName(productDetails.getName());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setStock(productDetails.getStock());
        existingProduct.setCreatedAt(LocalDateTime.now());

        validateProductPrice(existingProduct.getPrice());
        return productRepository.save(existingProduct);
    }

    // Xóa sản phẩm
    @Transactional(readOnly = false)
    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Product not found with id: " + id));

        // Kiểm tra xem sản phẩm có trong đơn hàng không
        if (orderService.hasProductInOrders(id)) {
            throw new BusinessException("Cannot delete product that is used in orders");
        }

        productRepository.delete(product);
    }

    // Logic nghiệp vụ: Tính giá sau giảm giá
    public Double calculateDiscountedPrice(Long productId, Double discountPercentage) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BusinessException("Product not found"));

        if (discountPercentage < 0 || discountPercentage > 100) {
            throw new BusinessException("Discount percentage must be between 0 and 100");
        }

        return product.getPrice() * (1 - discountPercentage / 100);
    }

    // Logic nghiệp vụ: Đặt trước tồn kho khi tạo đơn hàng
    @Transactional(readOnly = false)
    public void reserveStockForOrder(Order order) {
        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = productRepository.findById(orderItem.getProduct().getId())
                    .orElseThrow(() -> new BusinessException("Product not found"));

            if (product.getStock() < orderItem.getQuantity()) {
                throw new BusinessException("Insufficient stock for product: " + product.getName());
            }

            product.setStock(product.getStock() - orderItem.getQuantity());
            productRepository.save(product);
        }
    }

    // Validation nghiệp vụ
    private void validateProductPrice(Double price) {
        if (price == null || price <= 0) {
            throw new BusinessException("Product price must be greater than 0");
        }
    }

    private void validateProductStock(Integer stock) {
        if (stock == null || stock < 0) {
            throw new BusinessException("Product stock cannot be negative");
        }
    }
}

// Service phối hợp (OrderService)
@Service
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;

    @Autowired
    public OrderService(OrderRepository orderRepository, ProductService productService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
    }

    @Transactional(readOnly = false)
    public Order createOrder(@Valid Order order) {
        // Tính tổng giá trị đơn hàng
        Double totalAmount = calculateOrderTotal(order);
        order.setTotalAmount(totalAmount);
        order.setCreatedAt(LocalDateTime.now());

        // Đặt trước tồn kho
        productService.reserveStockForOrder(order);

        // Lưu đơn hàng
        return orderRepository.save(order);
    }

    private Double calculateOrderTotal(Order order) {
        return order.getOrderItems().stream()
                .mapToDouble(item -> item.getQuantity() * item.getProduct().getPrice())
                .sum();
    }

    public boolean hasProductInOrders(Long productId) {
        return orderRepository.existsByOrderItemsProductId(productId);
    }
}

// Exception tùy chỉnh
class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
```

#### Giải thích ví dụ
- **`@Service`**: Đánh dấu `ProductService` và `OrderService` là Spring Beans.
- **`@Validated`**: Kích hoạt validation cho các phương thức trong Service.
- **`@Transactional(readOnly = true)`**: Mặc định các phương thức là read-only transaction để tối ưu hiệu suất.
- **`@Transactional(readOnly = false)`**: Sử dụng cho các phương thức sửa đổi dữ liệu.
- **`@Cacheable` và `@CacheEvict`**: Tích hợp caching để tăng hiệu suất, xóa cache khi dữ liệu thay đổi.
- **Constructor Injection**: Sử dụng thay vì `@Autowired` field injection để tăng tính minh bạch và dễ kiểm thử.
- **Logic nghiệp vụ**: Các phương thức như `calculateDiscountedPrice` và `reserveStockForOrder` chứa các quy tắc kinh doanh.
- **Validation**: Kết hợp `@Valid` với validation nghiệp vụ tùy chỉnh (`validateProductPrice`, `validateProductStock`).

### 4.3. Ví dụ Entity liên quan

Dưới đây là các Entity `Product` và `Order` được sử dụng trong Service:

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

    public Product(String name, Double price, Integer stock, LocalDateTime createdAt) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.createdAt = createdAt;
    }

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

### 4.4. Ví dụ Repository liên quan

```java
package com.example.repository;

import com.example.model.Order;
import com.example.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);

    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findProductsByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
}

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsByOrderItemsProductId(Long productId);
}
```

### 4.5. Ví dụ Controller sử dụng Service

```java
package com.example.controller;

import com.example.model.Product;
import com.example.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.findAllProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product savedProduct = productService.createProduct(product);
        return ResponseEntity.status(201).body(savedProduct);
    }

    @GetMapping("/{id}/discounted-price")
    public ResponseEntity<Double> getDiscountedPrice(@PathVariable Long id, @RequestParam Double discount) {
        Double price = productService.calculateDiscountedPrice(id, discount);
        return ResponseEntity.ok(price);
    }
}
```

## 5. Các lưu ý khi coding Service trong Spring

- **Tách biệt logic nghiệp vụ**: Đặt tất cả quy tắc kinh doanh trong Service, tránh để logic trong Controller hoặc Repository.
- **Quản lý giao dịch**:
  - Sử dụng `@Transactional` cho các phương thức sửa đổi dữ liệu.
  - Đặt `readOnly = true` cho các phương thức chỉ đọc để tối ưu hiệu suất.
  - Đảm bảo transaction boundary được xác định đúng để tránh deadlock.
- **Dependency Injection**: Ưu tiên **constructor injection** thay vì `@Autowired` field injection để tăng tính minh bạch và dễ kiểm thử.
- **Validation**: Kết hợp Bean Validation (`@Valid`) với validation nghiệp vụ tùy chỉnh.
- **Xử lý ngoại lệ**: Ném các `BusinessException` tùy chỉnh để xử lý lỗi nghiệp vụ, tránh lan truyền exception thô.
- **Caching**: Sử dụng `@Cacheable` cho các phương thức truy xuất dữ liệu thường xuyên, `@CacheEvict` khi dữ liệu thay đổi.
- **Asynchronous Processing**: Sử dụng `@Async` cho các tác vụ không blocking như gửi email hoặc ghi log.
- **Testing**: Viết unit test cho Service với mock Repository để kiểm tra logic nghiệp vụ.

### 5.1. Constructor Injection (Khuyến nghị)

```java
@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
}
```

### 5.2. Cấu hình Caching

```java
package com.example.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("products", "orders");
    }
}
```

### 5.3. Asynchronous Processing

```java
package com.example.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class NotificationService {

    @Async
    public CompletableFuture<Void> sendOrderConfirmation(Order order) {
        // Giả lập gửi email xác nhận đơn hàng
        System.out.println("Sending email for order: " + order.getId());
        return CompletableFuture.completedFuture(null);
    }
}
```

Cấu hình để bật `@Async`:

```java
package com.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class AsyncConfig {
}
```

## 6. Lợi ích của Service trong Spring MVC

- **Tập trung logic nghiệp vụ**: Tất cả quy tắc kinh doanh được đặt ở một nơi, dễ bảo trì và mở rộng.
- **Tái sử dụng**: Service có thể được gọi từ nhiều Controller hoặc Service khác.
- **Quản lý giao dịch tốt**: `@Transactional` đảm bảo tính nhất quán của dữ liệu.
- **Dễ kiểm thử**: Service có thể được test độc lập với mock Repository.
- **Tách biệt trách nhiệm**: Controller mỏng (chỉ xử lý HTTP), Service dày (chứa logic nghiệp vụ).
- **Hiệu suất**: Tích hợp caching (`@Cacheable`) và async processing (`@Async`) để tối ưu hóa.

## 7. Thách thức khi sử dụng Service

- **Phức tạp giao dịch**: Cần hiểu rõ các thuộc tính của `@Transactional` như `propagation` và `isolation` để tránh lỗi.
- **Dependency hell**: Quá nhiều dependency có thể làm Service trở nên phức tạp, khó quản lý.
- **Testing phức tạp**: Cần mock nhiều Repository và Service phụ thuộc khi viết unit test.
- **Performance**: Caching không đúng cách có thể dẫn đến stale data.
- **Transaction boundary**: Xác định đúng phạm vi giao dịch để tránh deadlock hoặc hiệu suất kém.

## 8. Kết luận

Service là thành phần cốt lõi của tầng Model trong mô hình MVC với Spring Framework, chứa đựng toàn bộ logic nghiệp vụ và quy tắc kinh doanh của ứng dụng. Với các annotation như `@Service`, `@Transactional`, `@Cacheable`, và `@Async`, Service cung cấp khả năng quản lý giao dịch, caching, validation, và xử lý bất đồng bộ mạnh mẽ.

Khi triển khai Service, cần chú ý:
- Tách biệt logic nghiệp vụ rõ ràng.
- Sử dụng constructor injection để tăng tính minh bạch.
- Quản lý giao dịch cẩn thận với `@Transactional`.
- Tối ưu hiệu suất thông qua caching và async processing.
- Viết unit test đầy đủ để đảm bảo chất lượng.

Service giúp tạo ra kiến trúc ứng dụng **clean**, **testable**, và **maintainable**, là nền tảng cho các ứng dụng enterprise phức tạp và có khả năng mở rộng.

Nếu bạn cần thêm ví dụ cụ thể về cách triển khai Service với các tính năng nâng cao (như event-driven architecture, advanced caching, hoặc testing), hãy yêu cầu thêm thông tin!