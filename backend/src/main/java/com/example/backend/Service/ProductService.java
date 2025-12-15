package com.example.backend.Service;

import com.example.backend.DTO.Response.ProductPageResponse;
import com.example.backend.DTO.Response.ProductResponse;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.ProductRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepo productRepo;
    private final ObjectMapper objectMapper;

    public ProductPageResponse<ProductResponse> getAllProducts(Pageable pageable, Integer categoryId, String searchTerm) {
        try {
            // 1. Lấy tham số phân trang
            int pageNumber = pageable.getPageNumber();
            int pageSize = pageable.getPageSize();
            int offset = pageNumber * pageSize;

            // 2. KIỂM TRA LOẠI SORT
            boolean isHotSort = false;
            String sortProperty = "productId"; // Mặc định
            Sort sort = pageable.getSort();

            // Lấy thuộc tính sort đầu tiên
            if (sort.isSorted()) {
                Sort.Order order = sort.iterator().next();
                sortProperty = order.getProperty();
                if ("hot".equalsIgnoreCase(sortProperty)) {
                    isHotSort = true;
                }
            }
            long totalElements;
            String jsonData;
            if (isHotSort) {
                totalElements = productRepo.countHottestProducts(categoryId, searchTerm);
                jsonData = productRepo.getHottestProductsAsJsonPaged(pageSize, offset, categoryId, searchTerm);

            } else {
                totalElements = productRepo.countAllProducts(categoryId, searchTerm);
                jsonData = productRepo.getAllProductsAsJsonPaged(pageSize, offset, categoryId, searchTerm);
            }
            List<ProductResponse> content;
            if (jsonData == null || jsonData.equals("[]")) {
                content = Collections.emptyList();
            } else {
                content = objectMapper.readValue(jsonData, new TypeReference<List<ProductResponse>>() {});
            }

            int totalPages = (int) Math.ceil((double) totalElements / (double) pageSize);

            ProductPageResponse<ProductResponse> response = new ProductPageResponse<>();
            response.setContent(content);
            response.setPageNumber(pageNumber);
            response.setPageSize(pageSize);
            response.setTotalElements(totalElements);
            response.setTotalPages(totalPages);
            response.setLast(pageNumber >= (totalPages - 1));

            return response;

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing product data", e);
        }
    }


    public ProductResponse getProductById(Integer productId) {
        try {
            String jsonData = productRepo.getProductDetailAsJson(productId);

            if (jsonData == null || jsonData.equals("null")) {
                throw new ResourceNotFoundException("Product not found with id: " + productId);
            }

            return objectMapper.readValue(jsonData, ProductResponse.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing product data", e);
        }
    }


    @Transactional
    public String deleteProduct(Integer productId) {
        if (!productRepo.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        productRepo.deleteById(productId);
        return "Deleted product successful with id: " + productId;
    }

}