package com.backend.java_backend.Controllers.Retailer;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.Services.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/retailer")
public class RetailerInfoController {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @GetMapping("/test")
    public ResponseEntity<?> test(){
        return ResponseEntity.status(HttpStatus.OK).body("Hello World");
    }
    @GetMapping("/get-info")
    public ResponseEntity<?> getInfo(){
        String username =  SecurityContextHolder.getContext().getAuthentication().getName();
        User user = (User) customUserDetailsService.loadUserByUsername(username);
        if(user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        System.out.println("User object" + user.toString());
        return  ResponseEntity.status(HttpStatus.OK).body(user);
    }
}
