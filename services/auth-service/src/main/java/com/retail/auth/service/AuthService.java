package com.retail.auth.service;

import com.retail.auth.dto.*;
import com.retail.auth.entity.Role;
import com.retail.auth.entity.User;
import com.retail.auth.exception.BadRequestException;
import com.retail.auth.repository.RoleRepository;
import com.retail.auth.repository.UserRepository;
import com.retail.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new BadRequestException("Default role not found"));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .roles(Set.of(userRole))
                .build();

        User saved = userRepository.save(user);

        return mapUser(saved);
    }

    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtService.generateToken(user.getEmail());

        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(3600L)
                .user(mapUser(user))
                .build();
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        return mapUser(user);
    }

    private UserResponse mapUser(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(
                        user.getRoles()
                                .stream()
                                .map(Role::getName)
                                .collect(Collectors.toSet())
                )
                .build();
    }
}