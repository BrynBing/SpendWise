package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.UserSecurityAnswer;

public interface UserSecurityAnswerRepository extends JpaRepository<UserSecurityAnswer, Integer> {
    // UserSecurityAnswer findByUserId(Integer userId);
    // UserSecurityAnswer findByQuestionId(Integer questionId);
}
