package com.example.backend.Controller;

import com.example.backend.DTO.Request.PromotionRequest;
import com.example.backend.DTO.Response.PromotionResponse;
import com.example.backend.Service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PromotionController {
    private final PromotionService promotionService;

    // API: GET /api/promotions (Lấy tất cả)
    @GetMapping
    public ResponseEntity<List<PromotionResponse>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }

    // API: GET /api/promotions/1 (Lấy chi tiết 1 KM)
    @GetMapping("/{id}")
    public ResponseEntity<PromotionResponse> getPromotionById(@PathVariable Integer id) {
        return ResponseEntity.ok(promotionService.getPromotionById(id));
    }

    // API: POST /api/promotions (Tạo mới)
    @PostMapping
    public ResponseEntity<PromotionResponse> createPromotion(@RequestBody PromotionRequest request) {
        PromotionResponse newPromotion = promotionService.createPromotion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(newPromotion);
    }

    // API: PUT /api/promotions/1 (Cập nhật)
    @PutMapping("/{id}")
    public ResponseEntity<PromotionResponse> updatePromotion(@PathVariable Integer id, @RequestBody PromotionRequest request) {
        PromotionResponse updatedPromotion = promotionService.updatePromotion(id, request);
        return ResponseEntity.ok(updatedPromotion);
    }

    // API: DELETE /api/promotions/1 (Xóa)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePromotion(@PathVariable Integer id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.ok(Map.of("message", "Promotion deleted successfully with id: " + id));
    }


    @GetMapping("/product/{productId}")
    public ResponseEntity<PromotionResponse> getPromotionByProductId(@PathVariable Integer productId) {
        return ResponseEntity.ok(promotionService.getPromotionByProductId(productId));
    }
}