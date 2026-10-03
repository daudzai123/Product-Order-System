package com.example.productorder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_user", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore // never send the password hash to the frontend, even embedded in an Order
    @Column(nullable = false)
    private String password; // BCrypt-hashed

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}
