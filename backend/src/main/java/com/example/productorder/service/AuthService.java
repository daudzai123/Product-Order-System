package com.example.productorder.service;

import com.example.productorder.dto.JwtResponse;
import com.example.productorder.dto.LoginRequest;
import com.example.productorder.dto.RegisterRequest;
import com.example.productorder.model.Role;
import com.example.productorder.model.User;
import com.example.productorder.repository.UserRepository;
import com.example.productorder.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Anyone can self-register as CUSTOMER. Only allow ADMIN here for local/dev
        // seeding; in production, promote users to ADMIN manually or via a protected endpoint.
        Role role = "ADMIN".equalsIgnoreCase(request.getRole()) ? Role.ADMIN : Role.CUSTOMER;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new JwtResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public JwtResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new JwtResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
