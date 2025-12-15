    package com.example.backend.Service;

    import com.example.backend.DTO.Request.CreateProductRequest;
    import com.example.backend.DTO.Response.ProductResponse;
    import com.example.backend.Entity.*;
    import com.example.backend.Exception.ResourceNotFoundException;
    import com.example.backend.Repos.*;
    import org.springframework.stereotype.Service;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;
    import org.springframework.web.multipart.MultipartFile;

    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;
    import java.nio.file.StandardCopyOption;
    import java.util.List;
    import java.util.UUID;

    @Service
    public class ProductCreateService {
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

        // Tiêm service Đọc (GET) để gọi lại sau khi tạo xong
        @Autowired
        private ProductService productService;


        @Transactional // Rất quan trọng!
        public ProductResponse createProduct(CreateProductRequest request) {

            Product product = new Product();
            product.setName(request.getProductName());
            product.setDescription(request.getProductDescription());
            product.setProductImage(request.getProductMainImage());

            if (request.getCategoryId() != null) {
                ProductCategory category = categoryRepo.findById(request.getCategoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
                product.setCategory(category);
            }

            Product savedProduct = productRepo.save(product);

            if (request.getItems() != null) {
                for (CreateProductRequest.ItemCreateRequest reqItem : request.getItems()) {

                    ProductItem newItem = new ProductItem();
                    newItem.setProduct(savedProduct); // Gán vào Product cha
                    newItem.setSku(reqItem.getSku());
                    newItem.setQtyInStock(reqItem.getQtyInStock());
                    newItem.setProductImage(reqItem.getItemImage());
                    newItem.setPrice(reqItem.getPrice());

                    ProductItem savedItem = itemRepo.save(newItem);

                    if (reqItem.getVariationOptionIds() != null) {
                        for (Integer optionId : reqItem.getVariationOptionIds()) {

                            VariationOption option = variationOptionRepo.findById(optionId)
                                    .orElseThrow(() -> new ResourceNotFoundException("VariationOption not found with id: " + optionId));

                            ProductConfiguration newConfig = new ProductConfiguration();

                            ProductConfigurationId configId = new ProductConfigurationId();
                            configId.setProductItemId(savedItem.getId()); // ID từ item vừa lưu
                            configId.setVariationOptionId(optionId);

                            newConfig.setId(configId);
                            newConfig.setProductItem(savedItem);
                            newConfig.setVariationOption(option);

                            configRepo.save(newConfig);
                        }
                    }
                }
            }

            return productService.getProductById(savedProduct.getId());
        }
        private final Path rootImageLocation = Paths.get("E:\\nam4\\Project\\TeeHub-main\\perfect_react\\public\\Product");
        private String saveFile(MultipartFile file) throws IOException {
            if (file == null || file.isEmpty()) {
                return null;
            }

            String originalFilename = file.getOriginalFilename();
            String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;

            Path destinationFile = this.rootImageLocation.resolve(uniqueFilename)
                    .normalize().toAbsolutePath();

            // Tạo thư mục nếu chưa có
            if (!Files.exists(this.rootImageLocation)) {
                Files.createDirectories(this.rootImageLocation);
            }

            // Copy file vào thư mục đích
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            // Trả về TÊN FILE (ví dụ: "abc-123_2a.png") để lưu vào DB
            return uniqueFilename;
        }
        @Transactional
        public ProductResponse createProductWithImages(
                CreateProductRequest request,
                MultipartFile mainImageFile,
                List<MultipartFile> itemImageFiles
        ) throws IOException {

            // 1. Lưu ảnh chính
            String mainImageFilename = saveFile(mainImageFile);
            if (mainImageFilename == null) {
                throw new RuntimeException("Ảnh chính của sản phẩm là bắt buộc.");
            }

            // 2. Tạo Product entity
            Product product = new Product();
            product.setName(request.getProductName());
            product.setDescription(request.getProductDescription());
            product.setProductImage(mainImageFilename); // Lưu tên file đã xử lý

            ProductCategory category = categoryRepo.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);

            Product savedProduct = productRepo.save(product);

            // 3. Tạo các ProductItems
            for (int i = 0; i < request.getItems().size(); i++) {
                CreateProductRequest.ItemCreateRequest reqItem = request.getItems().get(i);

                ProductItem newItem = new ProductItem();
                newItem.setProduct(savedProduct);
                newItem.setSku(reqItem.getSku());
                newItem.setQtyInStock(reqItem.getQtyInStock());
                newItem.setPrice(reqItem.getPrice());

                //  Lưu ảnh của item
                if (itemImageFiles != null && i < itemImageFiles.size()) {
                    MultipartFile itemImageFile = itemImageFiles.get(i);
                    if (itemImageFile != null && !itemImageFile.isEmpty()) {
                        String itemImageFilename = saveFile(itemImageFile);
                        newItem.setProductImage(itemImageFilename);
                    }
                }

                ProductItem savedItem = itemRepo.save(newItem);

                //  Tạo Configurations
                if (reqItem.getVariationOptionIds() != null) {
                    for (Integer optionId : reqItem.getVariationOptionIds()) {
                        // Tìm entity VariationOption (ví dụ: "White" hoặc "M")
                        VariationOption option = variationOptionRepo.findById(optionId)
                                .orElseThrow(() -> new ResourceNotFoundException("VariationOption not found with id: " + optionId));

                        // Tạo bảng join ProductConfiguration
                        ProductConfiguration newConfig = new ProductConfiguration();

                        // Tạo Composite ID cho bảng join
                        ProductConfigurationId configId = new ProductConfigurationId();
                        configId.setProductItemId(savedItem.getId()); // ID của item vừa lưu
                        configId.setVariationOptionId(optionId);

                        newConfig.setId(configId);
                        newConfig.setProductItem(savedItem);
                        newConfig.setVariationOption(option);

                        // Lưu liên kết vào DB
                        configRepo.save(newConfig);
                    }
                }
            }

            return productService.getProductById(savedProduct.getId());
        }
    }
