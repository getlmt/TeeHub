package com.example.backend.DTO.Response;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class ProductPageResponse<T> {
    private List<T> content;         // Dữ liệu của trang hiện tại
    private int pageNumber;      // Số trang hiện tại (bắt đầu từ 0)
    private int pageSize;        // Kích thước trang
    private long totalElements;  // Tổng số phần tử
    private int totalPages;      // Tổng số trang
    private boolean isLast;          // Có phải trang cuối không
}
