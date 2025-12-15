# Tài liệu về Repository trong Mô hình MVC với Spring Framework

## 1. Giới thiệu về Repository
Trong mô hình MVC (Model-View-Controller), **Repository** là một thành phần thuộc tầng **Model**, chịu trách nhiệm tương tác trực tiếp với cơ sở dữ liệu để thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên các **Entities**. Trong Spring Framework, Repository thường được triển khai thông qua **Spring Data JPA**, một module của Spring giúp đơn giản hóa việc truy cập dữ liệu.

Repository đóng vai trò như một cầu nối giữa các **Entities** và cơ sở dữ liệu, cung cấp các phương thức để truy xuất, lưu trữ, cập nhật, và xóa dữ liệu mà không cần viết truy vấn SQL thủ công.

## 2. Vai trò của Repository trong MVC
Repository trong Spring Framework có các vai trò chính sau:
- **Truy cập dữ liệu**: Cung cấp các phương thức để tương tác với cơ sở dữ liệu, chẳng hạn như lấy danh sách, tìm theo ID, hoặc lưu dữ liệu.
- **Tách biệt logic truy cập dữ liệu**: Giữ logic truy cập cơ sở dữ liệu tách biệt khỏi logic nghiệp vụ (thường nằm trong Service) và logic điều khiển (trong Controller).
- **Tối ưu hóa truy vấn**: Sử dụng các tính năng của Spring Data JPA để tạo truy vấn tự động hoặc tùy chỉnh một cách hiệu quả.
- **Hỗ trợ quản lý giao dịch (Transaction)**: Đảm bảo các thao tác trên cơ sở dữ liệu được thực hiện một cách an toàn và nhất quán.
- **Cung cấp dữ liệu cho Service**: Repository trả về dữ liệu dưới dạng Entities hoặc các đối tượng khác, được Service sử dụng để xử lý logic nghiệp vụ.

## 3. Tính năng của Repository
- **Truy vấn tự động**: Spring Data JPA tự động cung cấp các phương thức CRUD cơ bản (như `findAll()`, `findById()`, `save()`, `delete()`) mà không cần viết code.
- **Truy vấn tùy chỉnh**: Hỗ trợ định nghĩa các phương thức truy vấn dựa trên tên phương thức (method naming convention) hoặc sử dụng annotation `@Query`.
- **Tích hợp với JPA**: Sử dụng các annotation như `@Query`, `@Param`, hoặc `@Modifying` để tùy chỉnh truy vấn.
- **Hỗ trợ phân trang và sắp xếp**: Cung cấp các tính năng như `Pageable` và `Sort` để xử lý dữ liệu lớn.
- **Quản lý giao dịch**: Tích hợp với `@Transactional` để đảm bảo tính toàn vẹn dữ liệu.
- **Tính mở rộng**: Có thể mở rộng để hỗ trợ các cơ sở dữ liệu khác nhau (SQL, NoSQL) thông qua các module của Spring Data.

## 4. Triển khai Repository trong Spring Framework
Trong Spring, Repository được triển khai bằng cách sử dụng **Spring Data JPA**, dựa trên giao diện `JpaRepository` hoặc các giao diện tương tự. Các annotation và cấu hình được sử dụng để định nghĩa và tùy chỉnh Repository.

### 4.1. Các annotation và giao diện chính của Spring Data JPA
- **`@Repository`**: Đánh dấu một interface là Repository, cho phép Spring quản lý nó như một Bean và xử lý các ngoại lệ liên quan đến cơ sở dữ liệu.
- **`JpaRepository<T, ID>`**: Giao diện cơ bản cung cấp các phương thức CRUD và phân trang. `T` là Entity, `ID` là kiểu dữ liệu của khóa chính.
- **`@Query`**: Định nghĩa truy vấn JPQL (Java Persistence Query Language) hoặc SQL gốc để tùy chỉnh truy vấn.
- **`@Param`**: Chỉ định tham số trong truy vấn JPQL.
- **`@Modifying`**: Đánh dấu một truy vấn là thao tác sửa đổi (INSERT, UPDATE, DELETE).
- **`@Transactional`**: Quản lý giao dịch cho các phương thức trong Repository, đảm bảo tính toàn vẹn dữ liệu.
- **`@EnableJpaRepositories`**: Cấu hình Spring để quét và tạo các Bean Repository (thường đặt trong lớp cấu hình).

### 4.2. Ví dụ triển khai Repository
Dưới đây là một ví dụ về Repository trong Spring Framework để quản lý Entity `Product` trong một ứng dụng thương mại điện tử. Repository này cung cấp các phương thức CRUD cơ bản và một số truy vấn tùy chỉnh.

```java
package com.example.repository;

import com.example.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Truy vấn tự động dựa trên tên phương thức
    List<Product> findByNameContainingIgnoreCase(String name);

    // Truy vấn tùy chỉnh sử dụng JPQL
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findProductsByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);

    // Truy vấn tùy chỉnh sử dụng SQL gốc
    @Query(value = "SELECT * FROM products WHERE stock > :stock", nativeQuery = true)
    List<Product> findProductsWithStockGreaterThan(@Param("stock") Integer stock);

    // Truy vấn sửa đổi (cập nhật stock)
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = :stock WHERE p.id = :id")
    int updateStock(@Param("id") Long id, @Param("stock") Integer stock);
}
```

#### Giải thích ví dụ
- **`@Repository`**: Đánh dấu `ProductRepository` là một Repository, cho phép Spring quản lý và xử lý ngoại lệ cơ sở dữ liệu.
- **`extends JpaRepository<Product, Long>`**: Kế thừa các phương thức CRUD cơ bản như `findAll()`, `findById()`, `save()`, `delete()`, v.v.
- **`findByNameContainingIgnoreCase`**: Truy vấn tự động dựa trên tên phương thức, tìm các sản phẩm có tên chứa chuỗi đầu vào (không phân biệt hoa thường).
- **`@Query`**: Định nghĩa truy vấn JPQL (`findProductsByPriceRange`) và SQL gốc (`findProductsWithStockGreaterThan`) để tìm sản phẩm theo khoảng giá hoặc số lượng tồn kho.
- **`@Modifying` và `@Transactional`**: Sử dụng cho phương thức `updateStock` để cập nhật số lượng tồn kho, đảm bảo giao dịch được quản lý.
- **`@Param`**: Liên kết tham số trong truy vấn với các tham số của phương thức.

### 4.3. Ví dụ Entity (Product) liên quan
Để minh họa cách Repository tương tác với Entity, dưới đây là mã của Entity `Product`:

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

### 4.4. Ví dụ Service sử dụng Repository
Repository thường được gọi bởi một lớp **Service** để xử lý logic nghiệp vụ. Dưới đây là một ví dụ về `ProductService`:

```java
package com.example.service;

import com.example.model.Product;
import com.example.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public Product update(Long id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        existingProduct.setName(product.getName());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStock(product.getStock());
        return productRepository.save(existingProduct);
    }

    @Transactional
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    public List<Product> findByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Product> findByPriceRange(Double minPrice, Double maxPrice) {
        return productRepository.findProductsByPriceRange(minPrice, maxPrice);
    }

    @Transactional
    public void updateStock(Long id, Integer stock) {
        int updatedRows = productRepository.updateStock(id, stock);
        if (updatedRows == 0) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
    }
}

class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

## 5. Các lưu ý khi coding Repository trong Spring
- **Kế thừa JpaRepository**: Sử dụng `JpaRepository` để tận dụng các phương thức CRUD có sẵn, giảm thiểu mã lệnh.
- **Truy vấn dựa trên tên phương thức**: Đặt tên phương thức theo quy ước của Spring Data JPA (ví dụ: `findBy`, `findBy{Property}And{Property}`) để tự động tạo truy vấn.
- **Sử dụng @Query khi cần**: Đối với các truy vấn phức tạp, sử dụng JPQL hoặc SQL gốc với `@Query`.
- **Quản lý giao dịch**: Sử dụng `@Transactional` cho các phương thức sửa đổi dữ liệu (`save`, `update`, `delete`) để đảm bảo tính toàn vẹn.
- **Tối ưu hóa hiệu suất**: 
  - Sử dụng phân trang (`Pageable`) cho các tập dữ liệu lớn.
  - Cân nhắc giữa `EAGER` và `LAZY` loading trong các quan hệ của Entity.
  - Tránh truy vấn không cần thiết bằng cách sử dụng các phương thức tối ưu.
- **Xử lý ngoại lệ**: Spring Data JPA tự động chuyển đổi các ngoại lệ cơ sở dữ liệu thành `DataAccessException`, nhưng cần xử lý các trường hợp như `EntityNotFoundException` trong Service hoặc Controller.
- **Định nghĩa cấu hình**: Đảm bảo bật `@EnableJpaRepositories` trong lớp cấu hình Spring để quét các Repository.

### 5.1. Cấu hình Spring Data JPA
Để sử dụng Repository, cần cấu hình Spring Data JPA trong ứng dụng. Ví dụ cấu hình trong file `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

Cần thêm annotation `@EnableJpaRepositories` trong lớp cấu hình chính:

```java
package com.example;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.example.repository")
public class AppConfig {
}
```

## 6. Lợi ích của Repository trong Spring MVC
- **Đơn giản hóa truy cập dữ liệu**: Spring Data JPA tự động cung cấp các phương thức CRUD, giảm công sức lập trình.
- **Tính mở rộng**: Hỗ trợ các truy vấn tùy chỉnh và tích hợp với nhiều loại cơ sở dữ liệu.
- **Tách biệt trách nhiệm**: Tách logic truy cập dữ liệu khỏi logic nghiệp vụ và điều khiển.
- **Hiệu suất cao**: Tối ưu hóa truy vấn thông qua phân trang, sắp xếp, và caching.
- **Dễ bảo trì**: Các phương thức truy vấn được định nghĩa rõ ràng, dễ kiểm thử và mở rộng.

## 7. Thách thức khi sử dụng Repository
- **Hiệu suất**: Các truy vấn tự động hoặc quan hệ phức tạp có thể gây ra vấn đề hiệu suất nếu không được tối ưu.
- **Phức tạp trong truy vấn tùy chỉnh**: Các truy vấn JPQL hoặc SQL gốc cần được viết cẩn thận để tránh lỗi cú pháp hoặc hiệu suất kém.
- **Quản lý giao dịch**: Cần cấu hình `@Transactional` đúng cách để tránh các vấn đề về đồng bộ hóa dữ liệu.
- **Học cách đặt tên phương thức**: Quy ước đặt tên phương thức của Spring Data JPA có thể phức tạp đối với người mới bắt đầu.

## 8. Kết luận
Repository là một thành phần quan trọng trong tầng Model của mô hình MVC, chịu trách nhiệm quản lý truy cập dữ liệu trong Spring Framework. Với Spring Data JPA, việc triển khai Repository trở nên đơn giản nhờ các phương thức CRUD tự động, truy vấn dựa trên tên phương thức, và các annotation như `@Query`, `@Transactional`. Khi coding, cần chú ý đến tối ưu hóa hiệu suất, quản lý giao dịch, và định nghĩa truy vấn rõ ràng để đảm bảo tính toàn vẹn và hiệu quả của ứng dụng.

Nếu bạn cần thêm ví dụ cụ thể về cách triển khai Repository cho một Entity khác hoặc cần giải thích chi tiết hơn về một tính năng cụ thể, hãy yêu cầu thêm thông tin!