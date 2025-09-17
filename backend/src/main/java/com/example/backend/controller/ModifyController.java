package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.service.ModifyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;

//Return
//{
//    "user_id": 1,
//    "username": "newName",
//    "email": "newemail@example.com",
//    "password_hash": "password123",
//    "phone_number": "123456789",
//    "profile_picture_url": "http://localhost:8080/picture/user_1_275850_1.jpg",
//    "created_at": "2025-09-13T08:42:35.389108",
//    "updated_at": "2025-09-17T19:19:34.2601697",
//    "last_login_at": null
//}


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

    @PostMapping("/{id}/picture")
    public ResponseEntity<User> uploadAvatar(
            @PathVariable Integer id,
            @RequestParam("picture_file") MultipartFile file) throws IOException {

        String fileName = "user_" + id + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get("uploads/picture");
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = "http://localhost:8080/picture/" + fileName;

        User updatedData = new User();
        updatedData.setProfile_picture_url(fileUrl);
        updatedData.setUpdated_at(LocalDateTime.now());

        User updatedUser = modifyService.updateUser(id, updatedData);

        return ResponseEntity.ok(updatedUser);
    }
}
