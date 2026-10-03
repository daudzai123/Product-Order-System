package com.example.productorder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
}
