package com.backend.java_backend.Controllers;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.DTOs.LoginRequest;
import com.backend.java_backend.DTOs.SignupRequest;
import com.backend.java_backend.Repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest signupRequest) {
        if (signupRequest.getUsername() == null || signupRequest.getUsername().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is required");
        }

        if (signupRequest.getPassword() == null || signupRequest.getPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password is required");
        }

        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already in use");
        }

        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setPass(passwordEncoder.encode(signupRequest.getPassword()));
        user.setEmail(signupRequest.getEmail());
        user.setRole(signupRequest.getRole());

        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> existingUser = userRepository.findByUsername(loginRequest.getUsername());

        if (existingUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username does not exist");
        }

        User user = existingUser.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPass())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("Login successful");
    }
}
