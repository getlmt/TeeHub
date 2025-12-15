package com.example.backend.Service;

import com.example.backend.DTO.Request.PromotionRequest;
import com.example.backend.DTO.Response.PromotionResponse;
import com.example.backend.Entity.Product;
import com.example.backend.Entity.Promotion;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.ProductRepo;
import com.example.backend.Repos.PromotionRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {
    private final PromotionRepo promotionRepo;
    private final ProductRepo productRepo;

    public List<PromotionResponse> getAllPromotions() {
        return promotionRepo.findAll().stream()
                .map(p -> new PromotionResponse(p))
                .collect(Collectors.toList());
    }

    public PromotionResponse getPromotionById(Integer promotionId) {
        Promotion promotion = promotionRepo.findById(promotionId)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + promotionId));
        return new PromotionResponse(promotion);
    }

    @Transactional
    public PromotionResponse createPromotion(PromotionRequest request) {
        Product product = productRepo.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        Promotion promotion = new Promotion();
        promotion.setName(request.getName());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountRate(request.getDiscountRate());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());

        promotion.setProduct(product);

        Promotion savedPromotion = promotionRepo.save(promotion);
        return new PromotionResponse(savedPromotion);
    }

    @Transactional
    public PromotionResponse updatePromotion(Integer promotionId, PromotionRequest request) {
        Promotion promotion = promotionRepo.findById(promotionId)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found"));

        Product product = productRepo.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        promotion.setName(request.getName());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountRate(request.getDiscountRate());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());

        promotion.setProduct(product);

        Promotion updatedPromotion = promotionRepo.save(promotion);
        return new PromotionResponse(updatedPromotion);
    }

    @Transactional
    public void deletePromotion(Integer promotionId) {
        if (!promotionRepo.existsById(promotionId)) {
            throw new ResourceNotFoundException("Promotion not found");
        }
        promotionRepo.deleteById(promotionId);
    }

    public PromotionResponse getPromotionByProductId(Integer productId) {
        List<Promotion> promotions = promotionRepo.findByProduct_Id(productId);

        if (promotions.isEmpty()) {
            throw new ResourceNotFoundException("No promotion found for product id: " + productId);
        }

        return new PromotionResponse(promotions.get(0));
    }
}