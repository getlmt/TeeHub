package com.example.backend.Service;

import com.example.backend.DTO.Request.UpdateProductRequest;
import com.example.backend.DTO.Response.ProductResponse;
import com.example.backend.Entity.*;
import com.example.backend.Exception.ResourceNotFoundException;
import com.example.backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;
@Service
public class ProductUpdateService {
    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private ProductCategoryRepo categoryRepo;

    @Autowired
    private ProductItemRepo itemRepo;

    @Autowired
    private ProductConfigurationRepo configRepo;

    @Autowired
    private VariationOptionRepo variationOptionRepo;

    // Tiêm service Đọc (GET) để gọi lại sau khi cập nhật xong
    @Autowired
    private ProductService productService;
    private final Path rootImageLocation = Paths.get("E:\\nam4\\Project\\TeeHub-main\\perfect_react\\public\\Product");

    private void reconcileProductItems(
            Product product,
            List<UpdateProductRequest.ItemSaveRequest> requestItems,
            List<MultipartFile> itemImageFiles
    ) throws IOException {

        List<ProductItem> existingItems = itemRepo.findByProductId(product.getId());
        Map<Integer, ProductItem> existingItemMap = existingItems.stream()
                .collect(Collectors.toMap(ProductItem::getId, item -> item));

        Set<Integer> requestItemIds = requestItems.stream()
                .map(UpdateProductRequest.ItemSaveRequest::getProductItemId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<ProductItem> itemsToDelete = existingItemMap.values().stream()
                .filter(item -> !requestItemIds.contains(item.getId()))
                .collect(Collectors.toList());

        itemRepo.deleteAll(itemsToDelete);

        // --- 4b. TẠO MỚI (Create) hoặc CẬP NHẬT (Update) ---
        int imageFileIndex = 0; // Biến đếm cho list ảnh item
        for (UpdateProductRequest.ItemSaveRequest reqItem : requestItems) {
            ProductItem itemToSave;

            if (reqItem.getProductItemId() == null) {
                // TẠO MỚI
                itemToSave = new ProductItem();
                itemToSave.setProduct(product);
            } else {
                // CẬP NHẬT
                itemToSave = existingItemMap.get(reqItem.getProductItemId());
                if (itemToSave == null) {
                    throw new ResourceNotFoundException("ProductItem not found: " + reqItem.getProductItemId());
                }
            }

            // Cập nhật text fields
            itemToSave.setSku(reqItem.getSku());
            itemToSave.setQtyInStock(reqItem.getQtyInStock());
            itemToSave.setPrice(reqItem.getPrice());

            if (itemImageFiles != null && imageFileIndex < itemImageFiles.size()) {
                MultipartFile itemImageFile = itemImageFiles.get(imageFileIndex);
                if (itemImageFile != null && !itemImageFile.isEmpty()) {
                    String itemImageFilename = saveFile(itemImageFile);
                    itemToSave.setProductImage(itemImageFilename);
                }
                imageFileIndex++; // Dịch chuyển đến file ảnh tiếp theo
            }
            // (Nếu không có file ảnh mới, nó sẽ giữ nguyên ảnh cũ)

            ProductItem savedItem = itemRepo.save(itemToSave);

            reconcileConfigurations(savedItem, reqItem.getVariationOptionIds());
        }
    }


    private void reconcileConfigurations(ProductItem item, List<Integer> requestOptionIds) {

        List<ProductConfiguration> existingConfigs = configRepo.findByProductItemId(item.getId());

        Set<Integer> existingOptionIds = existingConfigs.stream()
                .map(config -> config.getVariationOption().getId())
                .collect(Collectors.toSet());

        Set<Integer> requestOptionIdSet = new HashSet<>(requestOptionIds);

        List<ProductConfiguration> configsToDelete = existingConfigs.stream()
                .filter(config -> !requestOptionIdSet.contains(config.getVariationOption().getId()))
                .collect(Collectors.toList());

        configRepo.deleteAll(configsToDelete);

        // TẠO MỚI
        for (Integer optionId : requestOptionIds) {
            if (!existingOptionIds.contains(optionId)) {
                VariationOption option = variationOptionRepo.findById(optionId)
                        .orElseThrow(() -> new ResourceNotFoundException("VariationOption not found with id: " + optionId));

                ProductConfiguration newConfig = new ProductConfiguration();
                newConfig.setProductItem(item);
                newConfig.setVariationOption(option);

                ProductConfigurationId configId = new ProductConfigurationId();
                configId.setProductItemId(item.getId());
                configId.setVariationOptionId(optionId);
                newConfig.setId(configId);

                configRepo.save(newConfig);
            }
        }
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;
        Path destinationFile = this.rootImageLocation.resolve(uniqueFilename).normalize().toAbsolutePath();
        if (!Files.exists(this.rootImageLocation)) {
            Files.createDirectories(this.rootImageLocation);
        }
        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
        return uniqueFilename; // Trả về TÊN FILE MỚI
    }
    @Transactional
    public ProductResponse updateProductWithImages(
            Integer productId,
            UpdateProductRequest request,
            MultipartFile mainImageFile,
            List<MultipartFile> itemImageFiles
    ) throws IOException {

        // cập nhật Product
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        product.setName(request.getProductName());
        product.setDescription(request.getProductDescription());

        // 2. Cập nhật ảnh chính
        String mainImageFilename = saveFile(mainImageFile);
        if (mainImageFilename != null) {
            product.setProductImage(mainImageFilename); // Đặt tên file mới
        }
        // Nếu mainImageFile là null, nó sẽ giữ nguyên ảnh cũ

        // 3. Cập nhật Category
        if (request.getCategoryId() != null) {
            ProductCategory category = categoryRepo.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        //  4. Hòa giải ProductItems
        reconcileProductItems(product, request.getItems(), itemImageFiles);

        //  5. Trả về DTO đã cập nhật
        return productService.getProductById(productId);
    }
}
