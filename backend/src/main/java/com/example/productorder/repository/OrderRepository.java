package com.example.productorder.repository;

import com.example.productorder.model.Order;
import com.example.productorder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
