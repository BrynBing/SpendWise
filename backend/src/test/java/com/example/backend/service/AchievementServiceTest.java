package com.example.backend.service;

import com.example.backend.model.Achievement;
import com.example.backend.repository.AchievementRepository;
import com.example.backend.repository.ExpenseRecordRepository;
import com.example.backend.repository.SpendingGoalRepository;
import com.example.backend.repository.UserAchievementRepository;
import com.example.backend.model.UserAchievement;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;

import static org.mockito.Mockito.*;

public class AchievementServiceTest {

    @Mock
    private AchievementRepository achievementRepository;

    @Mock
    private UserAchievementRepository userAchievementRepository;

    @Mock
    private ExpenseRecordRepository expenseRecordRepository;

    @Mock
    private SpendingGoalRepository spendingGoalRepository;

    @InjectMocks
    private AchievementService achievementService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCheckSetGoal_shouldEarnAchievementWhenFirstGoalSet() {
        // given
        Integer userId = 1;
        when(spendingGoalRepository.countGoalsByUserId(userId)).thenReturn(1L);
        when(userAchievementRepository.findByUserIdAndAchievementCode(userId, "SET_GOAL"))
                .thenReturn(Optional.empty());
        when(achievementRepository.findByCode("SET_GOAL"))
                .thenReturn(new Achievement("SET_GOAL", "Set Goal", "Set a spending goal", null));

        // when
        achievementService.checkSetGoal(userId);

        // then
        verify(userAchievementRepository, times(1)).save(any(UserAchievement.class));
    }
}
