package com.backend.java_backend.DTOs;


import com.backend.java_backend.Classes.User;
import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String email;
    private String password;
    private String address;
    private String phoneNumber;
    private User.Role role;

}
