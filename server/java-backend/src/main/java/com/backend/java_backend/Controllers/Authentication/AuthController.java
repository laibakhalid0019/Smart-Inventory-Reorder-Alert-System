package com.backend.java_backend.Controllers.Authentication;

import com.backend.java_backend.Classes.User;
import com.backend.java_backend.DTOs.LoginRequest;
import com.backend.java_backend.DTOs.SignupRequest;
import com.backend.java_backend.Repos.UserRepo;
import com.backend.java_backend.Utils.JwtUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepo userRepo;

    //http://localhost:3000/auth/signup
    @GetMapping("/test")
    public ResponseEntity<?> testCors() {
        return ResponseEntity.ok("CORS working!");
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup( @RequestBody SignupRequest signupRequest) {
        logger.info("Received signup request: {}", signupRequest);

        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            logger.warn("Username already in use: {}", signupRequest.getUsername());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already in use");
        }

        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setPass(passwordEncoder.encode(signupRequest.getPassword()));
        user.setEmail(signupRequest.getEmail());
        user.setRole(signupRequest.getRole());
        System.out.println(signupRequest.getRole());
        user.setAddress(signupRequest.getAddress());
        user.setPhone(signupRequest.getPhoneNumber());

        userRepository.save(user);
        logger.info("User registered successfully: {}", user);
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

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        System.out.println(username);
        // If not authenticated or anonymous user
        if (username.equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        Optional<User> userOptional = Optional.ofNullable(userRepository.findByUsername(username));

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOptional.get();

        // Create response object without sensitive information
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("username", user.getUsername());
        userInfo.put("email", user.getEmail());
        userInfo.put("role", user.getRole().name());
        userInfo.put("address", user.getAddress());
        userInfo.put("phone", user.getPhone());

        return ResponseEntity.ok(userInfo);
    }




}
