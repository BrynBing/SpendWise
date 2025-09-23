package com.example.backend.controller;

import com.example.backend.dto.ResetPasswordConfirmDTO;
import com.example.backend.dto.ResetPasswordRequestDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.backend.service.PasswordResetService;


@RestController
@RequestMapping("/reset-password")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/request")
    public ResponseEntity<String> requestQuestion(@RequestBody ResetPasswordRequestDTO dto) {
        String question = passwordResetService.getSecurityQuestion(dto.getIdentifier());
        return ResponseEntity.ok(question);
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordConfirmDTO dto) {
        boolean success = passwordResetService.resetPassword(dto);
        if (success) {
            return ResponseEntity.ok("Password reset successful");
        } else {
            return ResponseEntity.status(401).body("Security answer incorrect");
        }
    }
}
