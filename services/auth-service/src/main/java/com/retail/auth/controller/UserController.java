package com.retail.auth.controller;

import com.retail.auth.dto.UserResponse;
import com.retail.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        return authService.getCurrentUser(authentication.getName());
    }
}