package com.example.backend.Service;

import com.example.backend.DTO.Request.Cart.AddToCart;
import com.example.backend.DTO.Request.Cart.UpdateCart;
import com.example.backend.DTO.Response.Cart.*;
import com.example.backend.Entity.*;
import com.example.backend.Repos.*;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ShoppingCartService {

    @Autowired
    private ShoppingCartRepo cartRepository;
    @Autowired
    private ShoppingCartItemRepo cartItemRepository;
    @Autowired
    private VariationOptionRepo variationOptionRepo;
    @Autowired
    private CustomProductRepo customProductRepo;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private ProductItemRepo productItemRepo;

    @Transactional
    public CartResponse addToCart(Integer userId, AddToCart request) {
        ShoppingCart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ShoppingCart newCart = new ShoppingCart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });

        ShoppingCartItem item = new ShoppingCartItem();
        item.setCart(cart);
        item.setQty(request.getQty());

        if (Boolean.TRUE.equals(request.getIsCustomed())) {
            if (request.getCustomProductId() == null) {
                throw new RuntimeException("Custom product ID cannot be null when isCustomed = true");
            }
            CustomProduct cp = customProductRepo.findById(request.getCustomProductId())
                    .orElseThrow(() -> new RuntimeException("Custom product not found with ID = " + request.getCustomProductId()));

            item.setCustomProductId(cp.getId());
            item.setIsCustomed(true);
            item.setProductItemId(null);
        } else {
            if (request.getProductItemId() == null) {
                throw new RuntimeException("Product item ID is required for non-custom products");
            }
            item.setProductItemId(request.getProductItemId());
            item.setIsCustomed(false);
            item.setCustomProductId(null);
        }

        item = cartItemRepository.save(item);
        entityManager.flush();

        if (request.getSelectedOptions() != null && !request.getSelectedOptions().isEmpty()) {
            List<VariationOption> options = variationOptionRepo.findAllById(request.getSelectedOptions());
            item.setSelectedOptions(options);
            cartItemRepository.save(item);
        }

        return mapToCartResponse(cartRepository.findById(cart.getId()).orElse(cart));
    }

    public CartResponse getCartByUserId(Integer userId) {
        ShoppingCart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for userId: " + userId));
        return mapToCartResponse(cart);
    }

    public CartResponse updateCartItem(Integer cartItemId, UpdateCart request) {
        ShoppingCartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if(request.getQty() != null && request.getQty() > 0) {
            item.setQty(request.getQty());
            cartItemRepository.save(item);
        }
        return mapToCartResponse(item.getCart());
    }

    public void removeCartItem(Integer cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    private CartResponse mapToCartResponse(ShoppingCart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUserId());

        List<ShoppingCartItemDTO> itemDTOs = new ArrayList<>();

        if (cart.getItems() != null) {
            for (ShoppingCartItem item : cart.getItems()) {
                ShoppingCartItemDTO dto = new ShoppingCartItemDTO();
                dto.setId(item.getId());
                dto.setCartId(cart.getId());
                dto.setQty(item.getQty());

                if (Boolean.TRUE.equals(item.getIsCustomed())) {
                    dto.setIs_customed(true);
                    dto.setPrice(400000);

                    dto.setStock(9999);

                    if (item.getCustomProductId() != null) {
                        Optional<CustomProduct> customOpt = customProductRepo.findById(item.getCustomProductId());
                        if (customOpt.isPresent()) {
                            CustomProduct cp = customOpt.get();
                            dto.setCustom_id(cp.getId());
                            dto.setProductImage(cp.getCustomImageUrl());
                            dto.setProductName(cp.getCustomName());
                        } else {
                            dto.setProductName("Sản phẩm tùy chỉnh (Lỗi data)");
                        }
                    } else {
                        dto.setProductName("Sản phẩm tùy chỉnh");
                    }
                    dto.setProductItemId(null);
                }
                else {
                    dto.setIs_customed(false);
                    dto.setProductItemId(item.getProductItemId());

                    if (item.getProductItemId() != null) {
                        dto.setProductName(productRepo.findNameById(item.getProductItemId()));
                        dto.setProductImage(cartItemRepository.findProductImageByCartItemId(item.getId()));

                        Integer price = cartItemRepository.findPriceByCartItemId(item.getId());
                        dto.setPrice(price != null ? price : 0);

                        Optional<ProductItem> productItemOpt = productItemRepo.findById(item.getProductItemId());
                        if (productItemOpt.isPresent()) {
                            dto.setStock(productItemOpt.get().getQtyInStock());
                        } else {
                            dto.setStock(0); // Không tìm thấy sản phẩm -> coi như hết hàng
                        }

                    } else {
                        dto.setProductName("Sản phẩm lỗi");
                        dto.setPrice(0);
                        dto.setStock(0);
                    }
                }

                if (item.getSelectedOptions() != null) {
                    dto.setSelectedOptions(item.getSelectedOptions().stream()
                            .map(opt -> {
                                VariationOptionDTO vo = new VariationOptionDTO();
                                vo.setId(opt.getId());
                                vo.setVariationId(opt.getVariation().getId());
                                vo.setValue(opt.getValue());
                                return vo;
                            })
                            .toList());
                } else {
                    dto.setSelectedOptions(new ArrayList<>());
                }

                itemDTOs.add(dto);
            }
        }

        response.setItems(itemDTOs);
        return response;
    }
}