package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.service.ModifyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class ModifyController {

    private final ModifyService modifyService;

    public ModifyController(ModifyService modifyService) {
        this.modifyService = modifyService;
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Integer id,
            @RequestBody User updatedUser) {
        User user = modifyService.updateUser(id, updatedUser);
        return ResponseEntity.ok(user);
    }

    // test controller
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}

