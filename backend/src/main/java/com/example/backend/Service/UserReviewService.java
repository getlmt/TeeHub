package com.example.backend.Service;

import com.example.backend.DTO.Request.UserReviewCreateRequest;
import com.example.backend.DTO.Response.ReviewStatsResponse;
import com.example.backend.DTO.Response.UserReviewResponse;
import com.example.backend.Entity.Product;
import com.example.backend.Entity.ProductItem;
import com.example.backend.Entity.SiteUser;
import com.example.backend.Entity.UserReview;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
@Service

public class UserReviewService {
    @Autowired
    private UserReviewRepo reviewRepo;

    @Autowired
    private ProductItemRepo itemRepo;

    @Autowired
    private SiteUserRepo userRepo;

    @Autowired private ShopOrderRepository shopOrderRepository;
    @Autowired private ProductRepo productRepo;

    public List<UserReviewResponse> getReviewsForProduct(Integer productId) {
        return reviewRepo.findByOrderedProduct_Product_IdOrderByCreatedAtDesc(productId)
                .stream()
                .map(UserReviewResponse::new) // Chuyển Entity -> DTO
                .collect(Collectors.toList());
    }

    public ReviewStatsResponse getRatingStatsForProduct(Integer productId) {
        // Kiểm tra xem query có trả về kết quả không
        List<Object[]> results = reviewRepo.getRatingStatsForProduct(productId);
        if (results == null || results.isEmpty() || results.get(0) == null) {
            // Trả về giá trị mặc định nếu không có review nào
            return new ReviewStatsResponse(0.0, 0L);
        }

        Object[] stats = results.get(0);
        Double average = (stats[0] instanceof Number) ? ((Number) stats[0]).doubleValue() : 0.0;
        Long count = (stats[1] instanceof Number) ? ((Number) stats[1]).longValue() : 0L;

        return new ReviewStatsResponse(average, count);
    }

    @Transactional
    public UserReviewResponse createReview(UserReviewCreateRequest request, Principal principal) { // <-- SỬA CHỮ KÝ HÀM
        // 1. Lấy thông tin
        ProductItem item = itemRepo.findByIdWithProduct(request.getProductItemId()) // <-- Sửa tên hàm
                .orElseThrow(() -> new ResourceNotFoundException("ProductItem not found"));
        String email = principal.getName();
        SiteUser user = userRepo.findByEmailAddress(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Lấy Product (sản phẩm cha) từ Item
        if (item.getProduct() == null) {
            throw new ResourceNotFoundException("Product relationship not found for this item");
        }
        // Lấy ID từ 'item'
        Integer productId = item.getProduct().getId();
        // Dùng 'productRepo' để tải lại 'product' một cách an toàn,
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        boolean hasPurchased = shopOrderRepository.hasUserPurchasedProduct(user.getUserId(), product.getId());

        if (!hasPurchased) {
            // Ném lỗi 403 (Cấm). Frontend sẽ nhận lỗi này.
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn cần mua sản phẩm để đánh giá.");
        }

        boolean hasReviewed = reviewRepo.existsByUserAndOrderedProduct_Product(user, product);

        if (hasReviewed) {
            // Ném lỗi 409 (Xung đột). Frontend sẽ nhận lỗi này.
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bạn đã đánh giá sản phẩm này rồi.");
        }

        // 4. Lưu review (nếu vượt qua 2 cổng trên)
        UserReview review = new UserReview();
        review.setOrderedProduct(item);
        review.setUser(user);
        review.setRatingValue(request.getRatingValue());
        review.setComment(request.getComment());
        UserReview savedReview = reviewRepo.save(review);
        return new UserReviewResponse(savedReview);
    }
    public List<UserReviewResponse> getFeaturedReviews(int limit) {
        // 1. Tạo yêu cầu phân trang: Lấy trang 0, 'limit' phần tử,
        //    sắp xếp theo 'createdAt' (ngày tạo) giảm dần (mới nhất trước)
        Pageable topN = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 2. Gọi Repo, tìm các review 5 SAO
        Page<UserReview> reviews = reviewRepo.findByRatingValue(5, topN);

        // 3. Chuyển Entity -> DTO
        return reviews.stream()
                .map(UserReviewResponse::new)
                .collect(Collectors.toList());
    }
}