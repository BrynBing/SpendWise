package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModifyUserDTO {
    private Integer id;
    private String username;
    private String email;
    private String phoneNumber;
    private String profilePictureUrl;
    private LocalDateTime updatedAt;
}