package com.example.backend.controller;

import com.example.backend.model.UserAchievement;
import com.example.backend.repository.UserAchievementRepository;
import com.example.backend.service.AchievementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/achievements")
public class AchievementController {

    private final AchievementService achievementService;
    private final UserAchievementRepository userAchievementRepository;

    public AchievementController(AchievementService achievementService,
                                 UserAchievementRepository userAchievementRepository) {
        this.achievementService = achievementService;
        this.userAchievementRepository = userAchievementRepository;
    }

    @GetMapping
    public List<UserAchievement> getUserAchievements(@RequestParam Integer userId) {
        return userAchievementRepository.findByUserId(userId);
    }
}
