package com.uims.backend.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private Role role = Role.ROLE_CITIZEN; // Default to citizen
    
    private Long departmentId; // Optional, only if role is department
}
