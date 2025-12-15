package com.example.backend.Controller;

import com.example.backend.DTO.Request.CreateProductRequest;
import com.example.backend.DTO.Request.UpdateProductRequest;
import com.example.backend.DTO.Response.ProductPageResponse;
import com.example.backend.DTO.Response.ProductResponse;
import com.example.backend.Service.ProductCreateService;
import com.example.backend.Service.ProductService;
import com.example.backend.Service.ProductUpdateService;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final ProductUpdateService productWriteService;
    private final ProductCreateService productCreateService;
    private final ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<ProductPageResponse<ProductResponse>> getAllProducts(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String searchTerm,

            @PageableDefault(size = 10, sort = "productId", direction = Sort.Direction.DESC) Pageable pageable
    ) {

        ProductPageResponse<ProductResponse> response = productService.getAllProducts(
                pageable,
                categoryId,
                searchTerm
        );

        return ResponseEntity.ok(response);
    }



    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Integer id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Integer id,
            @RequestParam("productName") String productName,
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam("productDescription") String productDescription,
            @RequestParam("items") String itemsJson,
            @RequestPart(value = "productMainImage", required = false) MultipartFile productMainImage,
            @RequestPart(value = "itemImages", required = false) List<MultipartFile> itemImages
    ) {
        try {
            UpdateProductRequest request = new UpdateProductRequest();
            request.setProductName(productName);
            request.setCategoryId(categoryId);
            request.setProductDescription(productDescription);

            List<UpdateProductRequest.ItemSaveRequest> items = objectMapper.readValue(
                    itemsJson,
                    new TypeReference<List<UpdateProductRequest.ItemSaveRequest>>() {}
            );
            request.setItems(items);

            ProductResponse updatedProduct = productWriteService.updateProductWithImages(
                    id,
                    request,
                    productMainImage,
                    itemImages
            );

            return ResponseEntity.ok(updatedProduct);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi xử lý request cập nhật sản phẩm: " + e.getMessage(), e);
        }
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProductResponse> createProduct(
            @RequestParam("productName") String productName,
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam("productDescription") String productDescription,
            @RequestParam("items") String itemsJson,
            @RequestPart("productMainImage") MultipartFile productMainImage,
            @RequestPart(value = "itemImages", required = false) List<MultipartFile> itemImages
    ) {
        try {
            CreateProductRequest request = new CreateProductRequest();
            request.setProductName(productName);
            request.setCategoryId(categoryId);
            request.setProductDescription(productDescription);

            List<CreateProductRequest.ItemCreateRequest> items = objectMapper.readValue(
                    itemsJson,
                    new TypeReference<List<CreateProductRequest.ItemCreateRequest>>() {}
            );
            request.setItems(items);

            ProductResponse newProduct = productCreateService.createProductWithImages(
                    request,
                    productMainImage,
                    itemImages
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi xử lý request tạo sản phẩm: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Integer id) {
        String message = productService.deleteProduct(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
}