package com.example.backend.controller;

import com.example.backend.model.SecurityQuestion;
import com.example.backend.model.User;
import com.example.backend.model.UserSecurityAnswer;
import com.example.backend.repository.QuestionRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.UserSecurityAnswerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/security-questions")
public class SecurityQuestionController {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final UserSecurityAnswerRepository userSecurityAnswerRepository;
    private final PasswordEncoder passwordEncoder;

    public SecurityQuestionController(
            UserRepository userRepository,
            QuestionRepository questionRepository,
            UserSecurityAnswerRepository userSecurityAnswerRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.userSecurityAnswerRepository = userSecurityAnswerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/all")
    public ResponseEntity<List<SecurityQuestion>> getAllQuestions() {
        try {
            List<SecurityQuestion> questions = questionRepository.findAll();
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveSecurityAnswer(@RequestBody Map<String, Object> payload) {
        try {
            String username = (String) payload.get("username");
            Integer questionId = (Integer) payload.get("questionId");
            String answer = (String) payload.get("answer");

            if (username == null || questionId == null || answer == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            // Find the user
            User user = userRepository.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // Find the security question
            SecurityQuestion question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new RuntimeException("Invalid security question"));

            // Check if user already has this security question answered
            UserSecurityAnswer existingAnswer = userSecurityAnswerRepository.findByUserAndQuestionId(user, questionId);
            if (existingAnswer != null) {
                // Update existing answer
                existingAnswer.setAnswer_hash(passwordEncoder.encode(answer));
                userSecurityAnswerRepository.save(existingAnswer);
            } else {
                // Create new security answer
                UserSecurityAnswer newAnswer = new UserSecurityAnswer();
                newAnswer.setUser(user);
                newAnswer.setQuestion(question);
                newAnswer.setAnswer_hash(passwordEncoder.encode(answer));
                userSecurityAnswerRepository.save(newAnswer);
            }

            return ResponseEntity.ok(Map.of("message", "Security question saved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save security question: " + e.getMessage());
        }
    }
}
