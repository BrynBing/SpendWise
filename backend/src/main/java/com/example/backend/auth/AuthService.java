package com.example.backend.auth;

import com.example.backend.User;
import com.example.backend.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User authenticate(String identifier, String rawPassword) throws AuthException {
        User user = userRepository.findByUsernameOrEmail(identifier, identifier);
        if (user == null) {
            throw new AuthException("Invalid username/email");
        }

        boolean ok = passwordEncoder.matches(rawPassword, user.getPassword_hash());
        if (!ok) {
            throw new AuthException("Invalid password");
        }

        user.setLast_login_at(LocalDateTime.now());
        userRepository.save(user);

        return user;
    }

    // 自定义异常
    public static class AuthException extends Exception {
        public AuthException(String message) {
            super(message);
        }
    }
}
