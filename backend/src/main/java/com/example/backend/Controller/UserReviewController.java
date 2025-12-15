package com.example.backend.Controller;

import com.example.backend.DTO.Request.UserReviewCreateRequest;
import com.example.backend.DTO.Response.ReviewStatsResponse;
import com.example.backend.DTO.Response.UserReviewResponse;
import com.example.backend.Service.UserReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserReviewController {

    @Autowired
    private UserReviewService reviewService;


    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<UserReviewResponse>> getProductReviews(
            @PathVariable Integer productId
    ) {
        return ResponseEntity.ok(reviewService.getReviewsForProduct(productId));
    }


    @GetMapping("/products/{productId}/rating-stats")
    public ResponseEntity<ReviewStatsResponse> getProductRatingStats(
            @PathVariable Integer productId
    ) {
        ReviewStatsResponse stats = reviewService.getRatingStatsForProduct(productId);
        return ResponseEntity.ok(stats);
    }


    @PostMapping("/reviews")
    public ResponseEntity<UserReviewResponse> createProductReview(
            @RequestBody UserReviewCreateRequest request, Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        UserReviewResponse newReview = reviewService.createReview(request, principal); // <-- SỬA LẠI
        return ResponseEntity.status(HttpStatus.CREATED).body(newReview);
    }
    @GetMapping("/reviews/featured")
    public ResponseEntity<List<UserReviewResponse>> getFeaturedReviews(
            @RequestParam(defaultValue = "3") int limit
    ) {
        return ResponseEntity.ok(reviewService.getFeaturedReviews(limit));
    }
}