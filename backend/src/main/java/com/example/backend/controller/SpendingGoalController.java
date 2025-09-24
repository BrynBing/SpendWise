package com.example.backend.controller;

import com.example.backend.dto.CreateSpendingGoalRequest;
import com.example.backend.dto.SpendingGoalResponse;
import com.example.backend.model.User;
import com.example.backend.security.SessionUserResolver;
import com.example.backend.service.SpendingGoalService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
@RequiredArgsConstructor
public class SpendingGoalController {

    private final SpendingGoalService goalService;
    private final SessionUserResolver sessionUserResolver;

    @GetMapping
    public ResponseEntity<List<SpendingGoalResponse>> listActiveGoals(HttpSession session) {
        User user = sessionUserResolver.getCurrentUser(session);
        var data = goalService.listActiveGoals(user);
        return ResponseEntity.ok(data);
    }

    @PostMapping
    public ResponseEntity<ApiMessage<SpendingGoalResponse>> createGoal(
            HttpSession session,
            @Valid @RequestBody CreateSpendingGoalRequest req
    ) {
        User user = sessionUserResolver.getCurrentUser(session);
        var created = goalService.createGoal(user, req);
        return ResponseEntity.ok(ApiMessage.success("Goal created successfully.", created));
    }

    @Data
    static class ApiMessage<T> {
        private String message;
        private T data;
        static <T> ApiMessage<T> success(String msg, T data) {
            var m = new ApiMessage<T>();
            m.message = msg; m.data = data; return m;
        }
    }
}
