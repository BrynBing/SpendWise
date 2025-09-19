package com.example.backend.repository;

import com.example.backend.model.ExpenseRecord;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRecordRepository extends JpaRepository<ExpenseRecord, Integer> {
    List<ExpenseRecord> findByUser(User user);
}
