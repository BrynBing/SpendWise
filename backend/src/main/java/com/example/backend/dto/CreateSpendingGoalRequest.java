package com.example.backend.dto;

import com.example.backend.model.GoalPeriod;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateSpendingGoalRequest {

    @NotBlank(message = "Goal name is required")
    private String goalName;

    @NotNull(message = "Target amount is required")
    @DecimalMin(value = "0.01", message = "Target amount must be greater than 0")
    private BigDecimal targetAmount;

    @DecimalMin(value = "0.00", message = "Current amount must be non-negative")
    private BigDecimal currentAmount;

    private String category;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    // Legacy fields - keeping for backward compatibility
    private Integer categoryId;
    private GoalPeriod period;
    private boolean confirmDuplicate = false;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean startNextPeriod;
}
