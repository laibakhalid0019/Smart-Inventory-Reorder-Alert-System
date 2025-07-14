package com.backend.java_backend.Services;


import com.backend.java_backend.Classes.User;
import com.backend.java_backend.DTOs.AuthResponse;
import com.backend.java_backend.DTOs.LoginRequest;
import com.backend.java_backend.DTOs.SignupRequest;
import com.backend.java_backend.Repos.UserRepo;
import com.backend.java_backend.Utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private   UserRepo userRepo;
    @Autowired
    private   PasswordEncoder passwordEncoder;
    @Autowired
    private  JwtUtils jwtUtils;
    public AuthResponse signup(SignupRequest request){
        // Check if username is already taken
        if(userRepo.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username already exists");
        }

        // Check if email is already in use
        if(userRepo.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encode the password
        user.setRole(request.getRole());

        // Save the user to the database
        userRepo.save(user);

        String token = jwtUtils.generateToken(user);
        return new AuthResponse(token, user.getRole().name());
    }

    public AuthResponse login(LoginRequest request){
        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(()->new RuntimeException("Username not found"));
        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
            throw new RuntimeException("Passwords don't match");
        }
        String token = jwtUtils.generateToken(user);
        return new AuthResponse(token,user.getRole().name());
    }
}
