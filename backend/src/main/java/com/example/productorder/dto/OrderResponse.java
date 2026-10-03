package com.example.productorder.dto;

import com.example.productorder.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private List<OrderItemResponse> items;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
}
