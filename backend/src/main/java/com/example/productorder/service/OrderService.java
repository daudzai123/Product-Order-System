package com.example.productorder.service;

import com.example.productorder.dto.OrderItemRequest;
import com.example.productorder.dto.OrderItemResponse;
import com.example.productorder.dto.OrderRequest;
import com.example.productorder.dto.OrderResponse;
import com.example.productorder.model.*;
import com.example.productorder.repository.OrderRepository;
import com.example.productorder.repository.ProductRepository;
import com.example.productorder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderResponse placeOrder(String customerEmail, OrderRequest request) {
        User user = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemReq.getProductId()));

            if (product.getStock() < itemReq.getQuantity()) {
                throw new IllegalStateException("Insufficient stock for product: " + product.getName());
            }

            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(lineTotal);

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build();

            order.addItem(orderItem);
        }

        order.setTotalAmount(total);
        return toResponse(orderRepository.save(order));
    }

    public List<OrderResponse> findAll() {
        return orderRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<OrderResponse> findByCustomer(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return orderRepository.findByUser(user).stream().map(this::toResponse).toList();
    }

    public OrderResponse updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        order.setStatus(status);
        return toResponse(orderRepository.save(order));
    }

    // Maps the entity graph to a flat DTO. This is what actually fixes the 500s:
    // it reads every lazy field (user, product) while still inside the
    // transactional service method, then hands Jackson plain Java objects with
    // no Hibernate proxies and no circular references to worry about.
    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPriceAtPurchase()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getName(),
                order.getUser().getEmail(),
                items,
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt()
        );
    }
}
