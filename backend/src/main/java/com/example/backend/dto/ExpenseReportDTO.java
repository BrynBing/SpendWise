package com.example.backend.dto;

public class ExpenseReportDTO {

    private Integer year;          // Year (e.g. 2025)
    private Integer periodValue;   // Month or Week number, can be null for yearly
    private String categoryName;   // Category (e.g. Food, Transport)
    private Double totalAmount;    // Sum of expenses

    // === Constructor ===
    public ExpenseReportDTO(Integer year, Integer periodValue, String categoryName, Double totalAmount) {
        this.year = year;
        this.periodValue = periodValue;
        this.categoryName = categoryName;
        this.totalAmount = totalAmount;
    }

    // === Getters & Setters ===
    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getPeriodValue() {
        return periodValue;
    }

    public void setPeriodValue(Integer periodValue) {
        this.periodValue = periodValue;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
