package com.example.backend.service;

import com.example.backend.dto.RegisterDTO;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Service
public class RegisterService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public RegisterService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterDTO dto) {
        if (userRepository.findByUsername(dto.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(dto.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPhone_number(dto.getPhoneNumber());
        user.setPassword_hash(passwordEncoder.encode(dto.getPassword()));

        LocalDateTime now = LocalDateTime.now();
        user.setCreated_at(now);
        user.setUpdated_at(now);

        User savedUser = userRepository.save(user);

        // set security question and answer if provided
        // if (dto.getQuestionId() != null && dto.getAnswer() != null) {
        //     SecurityQuestion question = questionRepository.findById(dto.getQuestionId())
        //         .orElseThrow(() -> new RuntimeException("Invalid security question"));

        //     UserSecurityAnswer answer = new UserSecurityAnswer();
        //     answer.setUser(savedUser);
        //     answer.setQuestion(question);
        //     answer.setAnswer_hash(passwordEncoder.encode(dto.getAnswer()));
        //     userSecurityAnswerRepository.save(answer);
        // }

        return savedUser;
    }

}
