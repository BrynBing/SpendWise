package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AchievementService {

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private ExpenseRecordRepository expenseRecordRepository;

    public void evaluateAchievements(Integer userId) {
        long totalCount = expenseRecordRepository.findByUser(new User(userId)).size();

        // 第一次支出
        if (totalCount >= 1) earnIfNotEarned(userId, "FIRST_EXPENSE");

        // 满 10 笔支出
        if (totalCount >= 10) earnIfNotEarned(userId, "TEN_RECORDS");
    }

    public void earnIfNotEarned(Integer userId, String code) {
        Achievement a = achievementRepository.findByCode(code);
        if (a == null) {
            System.out.println("Achievement not found: " + code);
            return;
        }

        Optional<UserAchievement> uaOpt =
                userAchievementRepository.findByUserIdAndAchievementCode(userId, code);

        if (uaOpt.isEmpty() || !uaOpt.get().getEarned()) {
            UserAchievement ua = uaOpt.orElseGet(() -> {
                UserAchievement newUa = new UserAchievement();
                User u = new User();
                u.setUser_id(userId);
                newUa.setUser(u);
                newUa.setAchievement(a);
                return newUa;
            });

            ua.setEarned(true);
            ua.setEarnedAt(LocalDateTime.now());
            userAchievementRepository.save(ua);

            System.out.println("User " + userId + " earned achievement: " + a.getTitle());
        }
    }
}
