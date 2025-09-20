package com.example.backend.controller;

import com.example.backend.auth.AuthService;
import com.example.backend.auth.LoginRequest;
import com.example.backend.auth.LoginResponse;
import com.example.backend.auth.SessionKeys;
import com.example.backend.dto.UserDTO;
import com.example.backend.model.User;
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
        AuthService.AuthResult result = authService.authenticate(body.getIdentifier(), body.getPassword());

        if (!result.isSuccess()) {
            return ResponseEntity.status(401).body(new LoginResponse(result.getMessage()));
        }

        User user = result.getUser();
        UserDTO dto = new UserDTO(user.getUser_id(), user.getUsername());
        session.setAttribute(SessionKeys.USER_DTO, dto);

        return ResponseEntity.ok(new LoginResponse("Login successful."));
    }

    @PostMapping("/login-and-redirect")
    public ResponseEntity<Void> loginAndRedirect(@RequestBody LoginRequest body, HttpSession session) {
        AuthService.AuthResult result = authService.authenticate(body.getIdentifier(), body.getPassword());

        if (!result.isSuccess()) {
            return ResponseEntity.status(401).build();
        }

        User user = result.getUser();
        UserDTO dto = new UserDTO(user.getUser_id(), user.getUsername());
        session.setAttribute(SessionKeys.USER_DTO, dto);

        return ResponseEntity.status(302).header("Location", "/home").build();
    }

    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(new LoginResponse("Logged out."));
    }
}
