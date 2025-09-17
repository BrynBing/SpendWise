package com.example.backend;

import com.example.backend.auth.AuthService;
import com.example.backend.auth.LoginRequest;
import com.example.backend.auth.LoginResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class SigninController {

    private final AuthService authService;

    public SigninController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest body, HttpSession session) {
        try {
            var user = authService.authenticate(body.getIdentifier(), body.getPassword());

            // Login successful ¡ú create session
            session.setAttribute("USER_ID", user.getUser_id());
            session.setAttribute("USERNAME", user.getUsername());

            return ResponseEntity.ok(new LoginResponse("Login successful."));
        } catch (AuthService.AuthException e) {
            // Catch specific authentication error and return message
            return ResponseEntity.status(401).body(new LoginResponse(e.getMessage()));
        }
    }
}
