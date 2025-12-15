package com.example.backend.Service;

import com.example.backend.DTO.Request.CreateOrderRequest;
import com.example.backend.DTO.Response.Order.OrderResponse;
import com.example.backend.Entity.*;
import com.example.backend.Repos.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepo orderRepo;
    private final OrderLineRepo orderLineRepo;
    private final CustomProductRepo customProductRepo;
    private final ShoppingCartRepo cartRepo;
    private final ShoppingCartItemRepo cartItemRepo;
    private final AddressRepo addressRepo;
    private final ProductItemRepo productItemRepo;

    public OrderService(
            OrderRepo orderRepo,
            OrderLineRepo orderLineRepo,
            CustomProductRepo customProductRepo,
            ShoppingCartRepo cartRepo,
            ShoppingCartItemRepo cartItemRepo,
            AddressRepo addressRepo,
            ProductItemRepo productItemRepo) {
        this.orderRepo = orderRepo;
        this.orderLineRepo = orderLineRepo;
        this.customProductRepo = customProductRepo;
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.addressRepo = addressRepo;
        this.productItemRepo = productItemRepo;
    }

    public List<OrderResponse> getOrdersByUserId(Integer userId) {
        List<ShopOrder> orders = orderRepo.findByUserId(userId);
        return orders.stream().map(this::mapToOrderResponse).toList();
    }

    public OrderResponse getOrderDetail(Integer orderId) {
        ShopOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("Order not found"));
        return mapToOrderResponse(order);
    }

    @Transactional
    public ShopOrder createOrderFromCart(Integer userId, List<Integer> selectedCartItemIds) {
        ShoppingCart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("Cart not found for userId " + userId));

        // Validate ownership
        validateCartItemOwnership(userId, selectedCartItemIds);

        ShopOrder order = new ShopOrder();
        order.setUserId(userId);
        order.setOrderDate(Instant.now());
        order.setPaymentStatus("Chưa thanh toán");
        order.setOrderStatus("Đang xử lý");

        List<OrderLine> orderLines = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Integer cartItemId : selectedCartItemIds) {
            ShoppingCartItem item = cartItemRepo.findById(cartItemId)
                    .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("CartItem not found: " + cartItemId));

            OrderLine line = new OrderLine();
            line.setShopOrder(order);
            line.setQty(item.getQty());

            if (Boolean.TRUE.equals(item.getIsCustomed())) {
                int fixedPrice = 400000;
                line.setPrice(fixedPrice);
                line.setProductItemId(null); // Không có phôi

                if (item.getCustomProductId() != null) {
                    CustomProduct cp = customProductRepo.findById(item.getCustomProductId())
                            .orElseThrow(() -> new RuntimeException("Custom product not found"));
                    line.setCustomProduct(cp);
                }

                totalAmount = totalAmount.add(BigDecimal.valueOf(fixedPrice).multiply(BigDecimal.valueOf(item.getQty())));
            }
            else {
                Integer price = cartItemRepo.findPriceByCartItemId(cartItemId);
                line.setPrice(price);
                line.setProductItemId(item.getProductItemId());
                line.setCustomProduct(null);

                if (price != null) {
                    totalAmount = totalAmount.add(BigDecimal.valueOf(price).multiply(BigDecimal.valueOf(item.getQty())));
                }
            }
            orderLines.add(line);
        }

        order.setItems(orderLines);
        order.setOrderTotal(totalAmount);

        ShopOrder savedOrder = orderRepo.save(order);
        orderLineRepo.saveAll(orderLines);
        cartItemRepo.deleteAllById(selectedCartItemIds);

        return savedOrder;
    }

    @Transactional
    public OrderResponse createOrderFromRequest(CreateOrderRequest request) {
        // 1. Validate input
        if (request == null) throw new com.example.backend.Exception.InvalidDataException("Request body cannot be null");
        Integer userId = request.getUserId();
        if (userId == null) throw new com.example.backend.Exception.InvalidDataException("userId is required");
        List<Integer> selectedItemIds = request.getSelectedItemIds();
        if (selectedItemIds == null || selectedItemIds.isEmpty()) throw new com.example.backend.Exception.InvalidDataException("selectedItemIds must not be empty");

        // Remove duplicates
        Set<Integer> dedup = new LinkedHashSet<>(selectedItemIds);
        selectedItemIds = new ArrayList<>(dedup);

        // 2. Validate Cart Ownership
        validateCartItemOwnership(userId, selectedItemIds);

        // 3. Init Order
        ShopOrder order = new ShopOrder();
        order.setUserId(userId);
        order.setOrderDate(Instant.now());
        order.setPaymentStatus("Chưa thanh toán");
        order.setOrderStatus("Đang xử lý");

        // 4. Get Cart Items
        List<ShoppingCartItem> selectedCartItems = cartItemRepo.findAllById(selectedItemIds);
        List<OrderLine> orderLines = new ArrayList<>();
        BigDecimal itemsTotal = BigDecimal.ZERO;

        // 5. Build Order Lines & Deduct Stock
        for (ShoppingCartItem item : selectedCartItems) {
            OrderLine line = new OrderLine();
            line.setShopOrder(order);
            line.setQty(item.getQty());

            if (Boolean.TRUE.equals(item.getIsCustomed())) {
                int FIXED_PRICE = 400000;
                line.setPrice(FIXED_PRICE);
                itemsTotal = itemsTotal.add(BigDecimal.valueOf(FIXED_PRICE).multiply(BigDecimal.valueOf(item.getQty())));

                if (item.getCustomProductId() != null) {
                    CustomProduct cp = customProductRepo.findById(item.getCustomProductId())
                            .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("Custom Product not found ID: " + item.getCustomProductId()));
                    line.setCustomProduct(cp);
                }
                line.setProductItemId(null);
            }
            else {
                if (item.getProductItemId() == null) {
                    throw new com.example.backend.Exception.InvalidDataException("Product Item ID missing for normal item: " + item.getId());
                }

                // Lấy ProductItem từ DB
                ProductItem productItem = productItemRepo.findById(item.getProductItemId())
                        .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("ProductItem not found: " + item.getProductItemId()));


                // 1. Kiểm tra số lượng (Validation)
                if (productItem.getQtyInStock() < item.getQty()) {
                    throw new com.example.backend.Exception.InvalidDataException(
                            "Sản phẩm (ID: " + productItem.getId() + ") không đủ hàng. " +
                                    "Tồn kho: " + productItem.getQtyInStock() + ", Yêu cầu: " + item.getQty()
                    );
                }

                // 2. Tính toán & Cập nhật số lượng mới
                int newStock = productItem.getQtyInStock() - item.getQty();
                productItem.setQtyInStock(newStock);

                // 3. Lưu xuống DB (Dòng quan trọng nhất để trừ kho)
                productItemRepo.save(productItem);


                BigDecimal currentPrice = productItem.getPrice() != null ? productItem.getPrice() : BigDecimal.ZERO;

                line.setPrice(currentPrice.intValue());
                line.setProductItemId(item.getProductItemId());
                line.setCustomProduct(null);

                itemsTotal = itemsTotal.add(currentPrice.multiply(BigDecimal.valueOf(item.getQty())));
            }
            orderLines.add(line);
        }

        order.setItems(orderLines);

        // 6. Address Info
        if (request.getShippingAddressId() != null) {
            Address address = addressRepo.findById(request.getShippingAddressId())
                    .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("Address not found"));
            order.setShippingAddress(address);
        }

        // 7. Payment & Shipping Info
        order.setPaymentTypeName(request.getPaymentTypeName());
        order.setPaymentProvider(request.getPaymentProvider());
        order.setPaymentAccountNumber(request.getPaymentAccountNumber());
        order.setPaymentStatus(request.getPaymentStatus());
        order.setShippingMethodName(request.getShippingMethodName());
        order.setShippingPrice(request.getShippingPrice());

        if ("Đã thanh toán".equals(request.getPaymentStatus())) {
            order.setPaymentDate(Instant.now());
        }

        // 8. Calculate Final Total
        BigDecimal shipping = request.getShippingPrice() != null ? request.getShippingPrice() : BigDecimal.ZERO;
        if (shipping.compareTo(BigDecimal.ZERO) < 0) {
            shipping = BigDecimal.ZERO;
        }
        order.setOrderTotal(itemsTotal.add(shipping));

        // 9. Save to DB
        ShopOrder saved = orderRepo.save(order);
        orderLineRepo.saveAll(orderLines);

        // 10. Response

        cartItemRepo.deleteAllById(selectedItemIds);

        return getOrderDetail(saved.getId());
    }

    private OrderResponse mapToOrderResponse(ShopOrder order) {
        OrderResponse dto = new OrderResponse();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setPaymentTypeName(order.getPaymentTypeName());
        dto.setPaymentProvider(order.getPaymentProvider());
        dto.setPaymentAccountNumber(order.getPaymentAccountNumber());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setPaymentDate(order.getPaymentDate());
        dto.setShippingMethodName(order.getShippingMethodName());
        dto.setShippingPrice(order.getShippingPrice());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderTotal(order.getOrderTotal());

        List<OrderLine> lines = orderLineRepo.findByShopOrderId(order.getId());
        dto.setItems(lines.stream().map(line -> {
            var itemDTO = new com.example.backend.DTO.Response.Order.OrderItemDTO();
            itemDTO.setId(line.getId());
            itemDTO.setQty(line.getQty());
            itemDTO.setPrice(line.getPrice());
            itemDTO.setProductItemId(line.getProductItemId());

            if (line.getCustomProduct() != null) {
                itemDTO.setIs_customed(true);
                itemDTO.setCustom_id(line.getCustomProduct().getId());
                itemDTO.setProductImage(line.getCustomProduct().getCustomImageUrl());
            } else if (line.getProductItemId() != null) {
                var pi = productItemRepo.findById(line.getProductItemId());
                itemDTO.setIs_customed(false);
                itemDTO.setProductImage(pi.map(com.example.backend.Entity.ProductItem::getProductImage).orElse(null));
            } else {
                itemDTO.setIs_customed(false);
                itemDTO.setProductImage(null);
            }

            itemDTO.setSelectedOptions(new ArrayList<>());
            return itemDTO;
        }).toList());

        return dto;
    }

    private void validateCartItemOwnership(Integer userId, List<Integer> cartItemIds) {
        if (cartItemIds == null || cartItemIds.isEmpty()) return;
        for (Integer id : cartItemIds) {
            if (!cartItemRepo.existsByIdAndCart_UserId(id, userId)) {
                throw new com.example.backend.Exception.InvalidDataException("Cart item " + id + " does not belong to user " + userId);
            }
        }
    }

    public Object getAllOrders() {
        List<ShopOrder> orders = orderRepo.findAll();
        return orders.stream().map(this::mapToOrderResponse).collect(Collectors.toList());
    }

    public OrderResponse updateOrderStatus(Integer orderId, String status) {
        ShopOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new com.example.backend.Exception.ResourceNotFoundException("Order not found"));
        order.setOrderStatus(status);
        ShopOrder updatedOrder = orderRepo.save(order);
        return mapToOrderResponse(updatedOrder);
    }
}