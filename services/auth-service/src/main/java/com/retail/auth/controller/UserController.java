package com.retail.auth.controller;

import com.retail.auth.dto.OrderRequest;
import com.retail.auth.dto.UserResponse;
import com.retail.auth.service.AuthService;
import com.retail.auth.service.OrderClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final OrderClientService orderClientService;

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        return authService.getCurrentUser(authentication.getName());
    }

    @PostMapping("/test/create-order")
    public String createOrder(@RequestBody OrderRequest request) {
        return orderClientService.createOrder(request);
    }
}