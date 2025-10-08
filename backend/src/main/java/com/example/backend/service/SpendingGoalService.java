package com.example.backend.service;

import com.example.backend.dto.CreateSpendingGoalRequest;
import com.example.backend.dto.SpendingGoalResponse;
import com.example.backend.model.*;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.SpendingGoalRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpendingGoalService {

    private final SpendingGoalRepository goalRepo;
    private final CategoryRepository categoryRepo;

    @Value("${goals.min-amount:1.00}")
    private BigDecimal minAmount;

    @Transactional(readOnly = true)
    public List<SpendingGoalResponse> listActiveGoals(User user) {
        return goalRepo.findByUserAndActiveTrueOrderByCreatedAtDesc(user)
                .stream().map(this::toResp).toList();
    }

    @Transactional
    public SpendingGoalResponse createGoal(User user, CreateSpendingGoalRequest req) {
        // New simplified structure
        if (req.getGoalName() != null && req.getDeadline() != null) {
            return createSimpleGoal(user, req);
        }
        
        // Legacy structure for backward compatibility
        if (req.getTargetAmount() == null
                || req.getTargetAmount().compareTo(minAmount) < 0) {
            throw new ValidationException("Amount must be at least " + minAmount);
        }

        var category = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        var existingOpt = goalRepo.findByUserAndCategoryEntity_CategoryIdAndPeriodAndActiveTrue(
                user, category.getCategoryId(), req.getPeriod()
        );

        if (existingOpt.isPresent() && !req.isConfirmDuplicate()) {
            throw new ValidationException(
                    "A goal for the same category and period already exists. " +
                            "Set confirmDuplicate=true to replace it."
            );
        }

        var start = req.getStartDate();
        var end = req.getEndDate();
        if (start == null || end == null) {
            var range = computeRange(LocalDate.now(), req.getPeriod(), req.isStartNextPeriod());
            start = range[0]; end = range[1];
        }

        existingOpt.ifPresent(old -> {
            old.setActive(false);
            goalRepo.save(old);
        });

        var goal = new SpendingGoal();
        goal.setUser(user);
        goal.setCategoryEntity(category);
        goal.setPeriod(req.getPeriod());
        goal.setTargetAmount(req.getTargetAmount());
        goal.setStartDate(start);
        goal.setEndDate(end);
        goal.setActive(true);

        var saved = goalRepo.save(goal);
        return toResp(saved);
    }

    @Transactional
    public SpendingGoalResponse createSimpleGoal(User user, CreateSpendingGoalRequest req) {
        if (req.getTargetAmount() == null || req.getTargetAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Target amount must be greater than 0");
        }

        var goal = new SpendingGoal();
        goal.setUser(user);
        goal.setGoalName(req.getGoalName());
        goal.setTargetAmount(req.getTargetAmount());
        goal.setCurrentAmount(req.getCurrentAmount() != null ? req.getCurrentAmount() : BigDecimal.ZERO);
        goal.setCategory(req.getCategory());
        goal.setDeadline(req.getDeadline());
        goal.setActive(true);

        var saved = goalRepo.save(goal);
        return toResp(saved);
    }

    @Transactional
    public SpendingGoalResponse updateGoal(Long goalId, User user, CreateSpendingGoalRequest req) {
        var goal = goalRepo.findById(goalId)
                .orElseThrow(() -> new EntityNotFoundException("Goal not found"));

        if (!goal.getUser().getUser_id().equals(user.getUser_id())) {
            throw new ValidationException("Unauthorized: You can only update your own goals");
        }

        if (req.getGoalName() != null) {
            goal.setGoalName(req.getGoalName());
        }
        if (req.getTargetAmount() != null) {
            goal.setTargetAmount(req.getTargetAmount());
        }
        if (req.getCurrentAmount() != null) {
            goal.setCurrentAmount(req.getCurrentAmount());
        }
        if (req.getCategory() != null) {
            goal.setCategory(req.getCategory());
        }
        if (req.getDeadline() != null) {
            goal.setDeadline(req.getDeadline());
        }

        var saved = goalRepo.save(goal);
        return toResp(saved);
    }

    @Transactional
    public void deleteGoal(Long goalId, User user) {
        var goal = goalRepo.findById(goalId)
                .orElseThrow(() -> new EntityNotFoundException("Goal not found"));

        if (!goal.getUser().getUser_id().equals(user.getUser_id())) {
            throw new ValidationException("Unauthorized: You can only delete your own goals");
        }

        goalRepo.delete(goal);
    }

    private LocalDate[] computeRange(LocalDate today, GoalPeriod period, boolean startNext) {
        if (startNext) {
            switch (period) {
                case WEEKLY -> today = today.with(java.time.DayOfWeek.MONDAY).plusWeeks(1);
                case MONTHLY -> today = today.withDayOfMonth(1).plusMonths(1);
                case YEARLY -> today = LocalDate.of(today.getYear() + 1, 1, 1);
            }
        }

        switch (period) {
            case WEEKLY -> {
                var start = today.with(java.time.DayOfWeek.MONDAY);
                var end = start.plusDays(6);
                return new LocalDate[]{start, end};
            }
            case MONTHLY -> {
                var start = today.withDayOfMonth(1);
                var end = start.plusMonths(1).minusDays(1);
                return new LocalDate[]{start, end};
            }
            case YEARLY -> {
                var start = LocalDate.of(today.getYear(), 1, 1);
                var end = LocalDate.of(today.getYear(), 12, 31);
                return new LocalDate[]{start, end};
            }
            default -> throw new IllegalArgumentException("Unsupported period");
        }
    }

    private SpendingGoalResponse toResp(SpendingGoal g) {
        var resp = new SpendingGoalResponse();
        resp.setGoalId(g.getGoalId());
        
        // New fields
        resp.setGoalName(g.getGoalName());
        resp.setTargetAmount(g.getTargetAmount());
        resp.setCurrentAmount(g.getCurrentAmount());
        resp.setCategory(g.getCategory());
        resp.setDeadline(g.getDeadline());
        
        // Legacy fields for backward compatibility
        if (g.getCategoryEntity() != null) {
            resp.setCategoryId(g.getCategoryEntity().getCategoryId());
            resp.setCategoryName(g.getCategoryEntity().getCategoryName());
        }
        resp.setPeriod(g.getPeriod());
        resp.setActive(g.isActive());
        
        return resp;
    }
}
