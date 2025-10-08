package com.example.backend.dto;

import com.example.backend.model.GoalPeriod;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SpendingGoalResponse {
    private Long goalId;
    private String goalName;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private String category;
    private LocalDate deadline;
    
    // Legacy fields - keeping for backward compatibility
    private Integer categoryId;
    private String categoryName;
    private GoalPeriod period;
    private boolean active;
}
