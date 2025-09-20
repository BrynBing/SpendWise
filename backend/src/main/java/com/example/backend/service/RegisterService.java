package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RegisterService {

    private final UserRepository userRepository;

    @Autowired
    public RegisterService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String register(User user) {
        // 检查用户名是否已存在
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return "Username already exists";
        }

        // 检查邮箱是否已存在
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return "Email already exists";
        }

        // 设置创建/更新时间戳
        LocalDateTime now = LocalDateTime.now();
        user.setCreated_at(now);
        user.setUpdated_at(now);

        // 保存用户（密码暂时明文，建议后续加密）
        userRepository.save(user);

        return "User registered successfully";
    }
}
