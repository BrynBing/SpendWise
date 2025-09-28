package com.example.backend.repository;

import com.example.backend.dto.ExpenseReportDTO;
import com.example.backend.model.ExpenseRecord;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRecordRepository extends JpaRepository<ExpenseRecord, Integer> {

    List<ExpenseRecord> findByUser(User user);

    // Weekly report for a specific year + week
    @Query("SELECT new com.example.backend.dto.ExpenseReportDTO(" +
            "YEAR(e.expenseDate), FUNCTION('week', e.expenseDate), c.categoryName, SUM(e.amount)) " +
            "FROM ExpenseRecord e JOIN e.category c " +
            "WHERE e.user.user_id = :userId " +
            "AND YEAR(e.expenseDate) = :year " +
            "AND FUNCTION('week', e.expenseDate) = :week " +
            "GROUP BY YEAR(e.expenseDate), FUNCTION('week', e.expenseDate), c.categoryName")
    List<ExpenseReportDTO> getWeeklyReportFor(
            @Param("userId") Integer userId,
            @Param("year") Integer year,
            @Param("week") Integer week);

    // Monthly report for a specific year + month
    @Query("SELECT new com.example.backend.dto.ExpenseReportDTO(" +
            "YEAR(e.expenseDate), MONTH(e.expenseDate), c.categoryName, SUM(e.amount)) " +
            "FROM ExpenseRecord e JOIN e.category c " +
            "WHERE e.user.user_id = :userId " +
            "AND YEAR(e.expenseDate) = :year " +
            "AND MONTH(e.expenseDate) = :month " +
            "GROUP BY YEAR(e.expenseDate), MONTH(e.expenseDate), c.categoryName")
    List<ExpenseReportDTO> getMonthlyReportFor(
            @Param("userId") Integer userId,
            @Param("year") Integer year,
            @Param("month") Integer month);

    // Yearly report for a specific year
    @Query("SELECT new com.example.backend.dto.ExpenseReportDTO(" +
            "YEAR(e.expenseDate), NULL, c.categoryName, SUM(e.amount)) " +
            "FROM ExpenseRecord e JOIN e.category c " +
            "WHERE e.user.user_id = :userId " +
            "AND YEAR(e.expenseDate) = :year " +
            "GROUP BY YEAR(e.expenseDate), c.categoryName")
    List<ExpenseReportDTO> getYearlyReportFor(
            @Param("userId") Integer userId,
            @Param("year") Integer year);
}
