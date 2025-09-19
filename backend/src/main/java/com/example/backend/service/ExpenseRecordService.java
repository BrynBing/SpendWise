package com.example.backend.service;

import com.example.backend.model.Category;
import com.example.backend.model.ExpenseRecord;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ExpenseRecordRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpenseRecordService {

    private final ExpenseRecordRepository expenseRecordRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public ExpenseRecordService(ExpenseRecordRepository expenseRecordRepository, UserRepository userRepository, CategoryRepository categoryRepository) {
        this.expenseRecordRepository = expenseRecordRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ExpenseRecord> getRecordsForUser(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return expenseRecordRepository.findByUser(user);
    }

    public ExpenseRecord createRecord(Integer userId, ExpenseRecord recordData) {
        User user = userRepository.findById(userId).orElseThrow();
        Category category = categoryRepository.findById(recordData.getCategory().getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        recordData.setUser(user);
        recordData.setCategory(category);
        return expenseRecordRepository.save(recordData);
    }

    public ExpenseRecord updateRecord(Integer userId, Integer recordId, ExpenseRecord updatedData) {
        User user = userRepository.findById(userId).orElseThrow();
        ExpenseRecord existing = expenseRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        if (!existing.getUser().equals(user)) {
            throw new RuntimeException("Unauthorized");
        }

        if (updatedData.getAmount() != null) existing.setAmount(updatedData.getAmount());
        if (updatedData.getCurrency() != null) existing.setCurrency(updatedData.getCurrency());
        if (updatedData.getDescription() != null) existing.setDescription(updatedData.getDescription());
        if (updatedData.getNotes() != null) existing.setNotes(updatedData.getNotes());
        if (updatedData.getPaymentMethod() != null) existing.setPaymentMethod(updatedData.getPaymentMethod());
        if (updatedData.getIsRecurring() != null) existing.setIsRecurring(updatedData.getIsRecurring());
//        if (updatedData.getRecurringScheduleId() != null) existing.setRecurringScheduleId(updatedData.getRecurringScheduleId());

        existing.setUpdatedAt(LocalDateTime.now());
        return expenseRecordRepository.save(existing);
    }

    public void deleteRecord(Integer userId, Integer recordId) {
        User user = userRepository.findById(userId).orElseThrow();
        ExpenseRecord existing = expenseRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        if (!existing.getUser().equals(user)) {
            throw new RuntimeException("Unauthorized");
        }

        expenseRecordRepository.deleteById(recordId);
    }
}
