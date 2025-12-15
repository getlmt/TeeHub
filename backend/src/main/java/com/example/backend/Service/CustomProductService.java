package com.example.backend.Service;

import com.example.backend.DTO.Request.CreateCustomProductRequest;
import com.example.backend.DTO.Response.CustomProductResponse;
import com.example.backend.Entity.CustomProduct;
import com.example.backend.Repos.CustomProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomProductService {

    private final CustomProductRepo repo;

    @Value("${app.custom.dir}")
    private String customDir;

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        Path dir = Paths.get(customDir).toAbsolutePath().normalize();
        Files.createDirectories(dir);

        String ori = Optional.ofNullable(file.getOriginalFilename()).orElse("img.png");
        String ext = ori.contains(".") ? ori.substring(ori.lastIndexOf('.')) : "";
        String safe = UUID.randomUUID().toString().replace("-", "") + ext.toLowerCase();

        Path target = dir.resolve(safe);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        return safe;
    }


    public CustomProductResponse createWithImage(CreateCustomProductRequest req, MultipartFile image, Integer currentUserId) {
        try {
            CustomProduct e = new CustomProduct();

            // 1. Map thông tin cơ bản
            if (req != null && req.getName() != null) {
                e.setCustomName(req.getName());
            }


            e.setUserId(currentUserId);

            // 2. Lưu file và chỉ lưu TÊN FILE vào Database
            if (image != null && !image.isEmpty()) {
                String fileName = saveFile(image);


                e.setCustomImageUrl(fileName);
            }

            CustomProduct saved = repo.save(e);

            // 3. Trả về Response
            CustomProductResponse resp = CustomProductResponse.builder()
                    .id(saved.getId())
                    .customName(saved.getCustomName())
                    .productId(saved.getProductId())
                    .customImageUrl(saved.getCustomImageUrl()) // Trả về tên file
                    .userId(saved.getUserId())
                    .description(req == null ? null : req.getDescription())
                    .price(req == null || req.getPrice() == null ? null : req.getPrice().toString())
                    .build();

            return resp;
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi lưu file ảnh", ex);
        }
    }
}