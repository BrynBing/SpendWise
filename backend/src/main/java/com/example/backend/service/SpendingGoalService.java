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
        if (req.getTargetAmount() == null
                || req.getTargetAmount().compareTo(minAmount) < 0) {
            throw new ValidationException("Amount must be at least " + minAmount);
        }

        var category = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));


        var existingOpt = goalRepo.findByUserAndCategory_CategoryIdAndPeriodAndActiveTrue(
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
        goal.setCategory(category);
        goal.setPeriod(req.getPeriod());
        goal.setTargetAmount(req.getTargetAmount());
        goal.setStartDate(start);
        goal.setEndDate(end);
        goal.setActive(true);

        var saved = goalRepo.save(goal);
        return toResp(saved);
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
        resp.setCategoryId(g.getCategory().getCategoryId());
        resp.setCategoryName(g.getCategory().getCategoryName());
        resp.setPeriod(g.getPeriod());
        resp.setTargetAmount(g.getTargetAmount());
        resp.setActive(g.isActive());
        return resp;
    }
}
