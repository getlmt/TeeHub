package com.example.backend.Controller;

import com.example.backend.DTO.Request.CreateOrderRequest;
import com.example.backend.DTO.Response.Order.OrderResponse;
import com.example.backend.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrderFromRequest(request));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/update-status/{orderId}")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Integer orderId,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
