package com.retail.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Set<String> roles;
}