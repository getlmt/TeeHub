package com.example.backend.Controller;

import com.example.backend.DTO.Request.Cart.AddToCart;
import com.example.backend.DTO.Request.Cart.UpdateCart;
import com.example.backend.DTO.Response.Cart.CartResponse;
import com.example.backend.Service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    @PostMapping("/users/{userId}/add")
    public ResponseEntity<CartResponse> addToCart(@PathVariable Integer userId, @RequestBody AddToCart request) {
        return ResponseEntity.ok(shoppingCartService.addToCart(userId, request));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Integer userId) {
        return ResponseEntity.ok(shoppingCartService.getCartByUserId(userId));
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(@PathVariable Integer cartItemId, @RequestBody UpdateCart request) {
        return ResponseEntity.ok(shoppingCartService.updateCartItem(cartItemId, request));
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Integer cartItemId) {
        shoppingCartService.removeCartItem(cartItemId);
        return ResponseEntity.noContent().build();
    }
}
