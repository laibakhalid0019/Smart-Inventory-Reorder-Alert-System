package com.backend.java_backend.DTOs;


public class AuthResponse {
    private String token;
    private String role;
    private String username;

    public AuthResponse(String token, String name) {
        this.token = token;
        this.username = name;
        this.role = name;
    }
}
