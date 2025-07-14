package com.backend.java_backend.Controllers;


import com.backend.java_backend.Classes.User;
import com.backend.java_backend.DTOs.AuthResponse;
import com.backend.java_backend.DTOs.LoginRequest;
import com.backend.java_backend.DTOs.SignupRequest;
import com.backend.java_backend.Repos.UserRepo;
import com.backend.java_backend.Services.AuthService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping(value = "/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request){
        return ResponseEntity.ok(authService.signup(request));
    }

    @GetMapping("/get")
    public int get(){
        return 1;
    }

    @PostMapping(value = "/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){
        return ResponseEntity.ok(authService.login(request));
    }
}
