package com.example.backend.Controller;

import com.example.backend.DTO.Request.CreateCustomProductRequest;
import com.example.backend.DTO.Response.CustomProductResponse;
import com.example.backend.Entity.CustomProduct;
import com.example.backend.Repos.CustomProductRepo;
import com.example.backend.Repos.ShoppingCartItemRepo; // ✅ Import Repo giỏ hàng
import com.example.backend.Service.CustomProductService;
import com.example.backend.Sercurity.MyUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CustomProductController {

    private final CustomProductService service;
    private final CustomProductRepo customProductRepo;
    private final ShoppingCartItemRepo shoppingCartItemRepo;

    @PostMapping(value = "/custom-products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomProductResponse> create(
            @RequestPart("payload") CreateCustomProductRequest payload,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal MyUserDetails me
    ) {
        Integer userId = me == null ? null : me.getUserId();
        CustomProductResponse resp = service.createWithImage(payload, image, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping("/custom-products/user/{userId}")
    public ResponseEntity<List<CustomProduct>> getMyDesigns(@PathVariable Integer userId) {
        List<CustomProduct> list = customProductRepo.findByUserId(userId);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/custom-products/{id}")
    public ResponseEntity<?> deleteDesign(@PathVariable Integer id) {
        // 1. Kiểm tra tồn tại
        if (!customProductRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // 2. Kiểm tra ràng buộc: Nếu đang nằm trong giỏ hàng -> CẤM XÓA
        if (shoppingCartItemRepo.existsByCustomProductId(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Không thể xóa: Thiết kế này đang nằm trong giỏ hàng của bạn!");
        }

        // 3. Nếu an toàn -> Xóa
        customProductRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}