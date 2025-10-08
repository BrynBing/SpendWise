package com.example.backend.repository;

import com.example.backend.model.GoalPeriod;
import com.example.backend.model.SpendingGoal;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SpendingGoalRepository extends JpaRepository<SpendingGoal, Long> {

    List<SpendingGoal> findByUserAndActiveTrueOrderByCreatedAtDesc(User user);

    // Updated to use categoryEntity instead of category (since category is now a String)
    Optional<SpendingGoal> findByUserAndCategoryEntity_CategoryIdAndPeriodAndActiveTrue(
            User user, Integer categoryId, GoalPeriod period
    );

    boolean existsByUserAndCategoryEntity_CategoryIdAndPeriodAndActiveTrue(
            User user, Integer categoryId, GoalPeriod period
    );
}
