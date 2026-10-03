package com.example.productorder.service;

import com.example.productorder.dto.ProductRequest;
import com.example.productorder.model.Product;
import com.example.productorder.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
    }

    public Product create(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .build();
        return productRepository.save(product);
    }

    public Product update(Long id, ProductRequest request) {
        Product product = findById(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        return productRepository.save(product);
    }

    public void delete(Long id) {
        // A product already referenced by an OrderItem can't be hard-deleted —
        // the database's foreign key rejects it. Turn that DB-level error into
        // a clear message instead of letting it surface as a raw 500.
        try {
            productRepository.deleteById(id);
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalStateException(
                    "Can't delete this product — it's part of one or more existing orders. " +
                    "Consider setting its stock to 0 instead."
            );
        }
    }
}
