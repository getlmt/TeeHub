package com.example.backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.avatar.dir}")
    private String avatarDir;

    @Value("${app.product.dir}")
    private String productDir;

    private Path ensureDir(String dir) throws IOException {
        Path path = Paths.get(dir).toAbsolutePath().normalize();
        if (!Files.exists(path)) Files.createDirectories(path);
        return path;
    }

    public String saveAvatar(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        String filename = UUID.randomUUID() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path avatarPath = ensureDir(avatarDir).resolve(filename);
        Files.copy(file.getInputStream(), avatarPath, StandardCopyOption.REPLACE_EXISTING);

        return filename; // chỉ trả tên file, controller/service sẽ format URL ngoài
    }

    public String saveProductImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        String filename = UUID.randomUUID() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path productPath = ensureDir(productDir).resolve(filename);
        Files.copy(file.getInputStream(), productPath, StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }

    public void deleteAvatar(String filename) {
        try {
            Path avatarPath = Paths.get(avatarDir).resolve(filename);
            Files.deleteIfExists(avatarPath);
        } catch (IOException ignored) {
        }
    }
}
