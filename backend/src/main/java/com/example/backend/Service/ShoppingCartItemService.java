package com.example.backend.Service;

import com.example.backend.Entity.ShoppingCartItem;
import com.example.backend.Repos.ShoppingCartItemRepo;
import com.example.backend.Repos.ShoppingCartRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ShoppingCartItemService {

    private final ShoppingCartItemRepo shoppingCartItemRepository;
    private final ShoppingCartRepo shoppingCartRepo;

    public ShoppingCartItemService(ShoppingCartItemRepo shoppingCartItemRepository,
                                   ShoppingCartRepo shoppingCartRepo) {
        this.shoppingCartItemRepository = shoppingCartItemRepository;
        this.shoppingCartRepo = shoppingCartRepo;
    }

    // Lấy tất cả item
    public List<ShoppingCartItem> getAllItems() {
        return shoppingCartItemRepository.findAll();
    }

    // Lấy item theo id
    public Optional<ShoppingCartItem> getItemById(Integer id) {
        return shoppingCartItemRepository.findById(id);
    }

    // Lấy danh sách item theo cart_id
    public List<ShoppingCartItem> getItemsByCartId(Integer cartId) {
        return shoppingCartItemRepository.findByCartId(cartId);
    }

    // Lấy item cụ thể theo cart_id và product_item_id
    public Optional<ShoppingCartItem> getItemByCartAndProduct(Integer cartId, Integer productItemId) {
        return shoppingCartItemRepository.findByCartId(cartId)
                .stream()
                .filter(i -> i.getProductItemId() != null && i.getProductItemId().equals(productItemId))
                .findFirst();
    }

    // Thêm mới item
    @Transactional
    public ShoppingCartItem addItem(ShoppingCartItem item) {
        if (item == null || item.getCart() == null || item.getCart().getId() == null) {
            throw new IllegalArgumentException("Cart is required");
        }
        if (item.getProductItemId() == null) {
            throw new IllegalArgumentException("productItemId is required");
        }
        if (item.getQty() == null || item.getQty() <= 0) {
            throw new IllegalArgumentException("qty must be > 0");
        }

        Integer cartId = item.getCart().getId();
        if (shoppingCartRepo.findById(cartId).isEmpty()) {
            throw new IllegalArgumentException("Cart not found: " + cartId);
        }

        ShoppingCartItem existing = shoppingCartItemRepository.findByCartId(cartId)
                .stream()
                .filter(i -> i.getProductItemId() != null && i.getProductItemId().equals(item.getProductItemId()))
                .findFirst()
                .orElse(null);
        if (existing != null) {
            int newQty = (existing.getQty() != null ? existing.getQty() : 0) + item.getQty();
            existing.setQty(newQty);
            return shoppingCartItemRepository.save(existing);
        }

        return shoppingCartItemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Integer id) {
        shoppingCartItemRepository.deleteById(id);
    }

    // Xóa toàn bộ item theo cart_id (ví dụ khi người dùng xóa giỏ hàng)
    @Transactional
    public void deleteItemsByCartId(Integer cartId) {
        if (cartId == null) return;
        if (shoppingCartRepo.findById(cartId).isEmpty()) {
            return;
        }
        List<ShoppingCartItem> items = shoppingCartItemRepository.findByCartId(cartId);
        if (items.isEmpty()) return;
        shoppingCartItemRepository.deleteAll(items);
    }
}
