package com.example.productorder.controller;

import com.example.productorder.dto.OrderRequest;
import com.example.productorder.dto.OrderResponse;
import com.example.productorder.model.OrderStatus;
import com.example.productorder.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest request, Authentication auth) {
        return ResponseEntity.ok(orderService.placeOrder(auth.getName(), request));
    }

    // Customer sees only their own orders; admin sees every order.
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> myOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.findByCustomer(auth.getName()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<OrderResponse>> allOrders() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }
}
