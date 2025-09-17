package com.example.backend;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer user_id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    private String password_hash;
    private String phone_number;
    private String profile_picture_url;

    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime last_login_at;

    // Getters and setters
    public Integer getUser_id() { return user_id; }
    public void setUser_id(Integer user_id) { this.user_id = user_id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword_hash() { return password_hash; }
    public void setPassword_hash(String password_hash) { this.password_hash = password_hash; }

    public String getPhone_number() { return phone_number; }
    public void setPhone_number(String phone_number) { this.phone_number = phone_number; }

    public String getProfile_picture_url() { return profile_picture_url; }
    public void setProfile_picture_url(String profile_picture_url) { this.profile_picture_url = profile_picture_url; }

    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }

    public LocalDateTime getUpdated_at() { return updated_at; }
    public void setUpdated_at(LocalDateTime updated_at) { this.updated_at = updated_at; }

    public LocalDateTime getLast_login_at() { return last_login_at; }
    public void setLast_login_at(LocalDateTime last_login_at) { this.last_login_at = last_login_at; }
}
