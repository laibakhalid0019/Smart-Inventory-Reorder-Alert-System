package com.backend.java_backend.Controllers;

import com.backend.java_backend.Classes.User;
import com.backend.java_backend.DTOs.LoginRequest;
import com.backend.java_backend.DTOs.SignupRequest;
import com.backend.java_backend.Repos.UserRepo;
import com.backend.java_backend.Utils.JwtUtils;
import com.backend.java_backend.DTOs.AuthResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signup")
    public ResponseEntity<String> signup( @RequestBody SignupRequest signupRequest) {
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

    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        System.out.println("LOGIN HIT");

        Optional<User> existingUser = Optional.ofNullable(userRepository.findByUsername(loginRequest.getUsername()));

        if (existingUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username does not exist");
        }

        User user = existingUser.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password");
        }

        String token = jwtUtils.generateToken(user);

        // ✅ Store token in HttpOnly cookie
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 day
        response.addCookie(cookie);

        Map<String, String> res = new HashMap<>();
        res.put("role", user.getRole().name());
        res.put("username", user.getUsername());

        return ResponseEntity.ok(res);
    }

    @PostMapping(value = "/logout", produces = "application/json")
    public ResponseEntity<?> logout(HttpServletResponse response, HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    cookie.setValue(null);
                    cookie.setPath("/"); // Must match original path
                    cookie.setMaxAge(0); // Invalidate cookie
                    response.addCookie(cookie); // Send back to client
                    break;
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body("Logout successfully");
    }



}
