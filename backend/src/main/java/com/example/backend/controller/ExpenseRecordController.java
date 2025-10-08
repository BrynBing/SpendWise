package com.example.backend.controller;

import com.example.backend.dto.CategoryDTO;
import com.example.backend.dto.ExpenseRecordDTO;
import com.example.backend.dto.ExpenseReportDTO;
import com.example.backend.dto.UserDTO;
import com.example.backend.model.ExpenseRecord;
import com.example.backend.service.ExpenseRecordService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/records")
public class ExpenseRecordController {

    private final ExpenseRecordService recordService;

    public ExpenseRecordController(ExpenseRecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseRecordDTO>> getRecords(HttpSession session) {
        // [
        //    {
        //        "expenseId": 3,
        //        "user": {
        //            "id": 6,
        //            "username": "bob"
        //        },
        //        "category": {
        //            "id": 9,
        //            "name": "Food"
        //        },
        //        "amount": 12.50,
        //        "currency": "USD",
        //        "expenseDate": "2025-09-19",
        //        "description": "Lunch at cafe",
        //        "isRecurring": null,
        //        "recurringScheduleId": null,
        //        "paymentMethod": null
        //    },
        //        ...
        // ]
        UserDTO user = (UserDTO) session.getAttribute("USER");
        Integer userId = user.getId();
        List<ExpenseRecordDTO> dtoList = recordService.getRecordsForUser(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @PostMapping
    public ResponseEntity<ExpenseRecordDTO> createRecord(@RequestBody ExpenseRecord recordData, HttpSession session) {
        // {
        //    "expenseId": 8,
        //    "user": {
        //        "id": 6,
        //        "username": "bob"
        //    },
        //    "category": {
        //        "id": 9,
        //        "name": "Food"
        //    },
        //    "amount": 50,
        //    "currency": "USD",
        //    "expenseDate": "2025-09-19",
        //    "description": null,
        //    "isRecurring": null,
        //    "recurringScheduleId": null,
        //    "paymentMethod": null
        //}
        UserDTO user = (UserDTO) session.getAttribute("USER");
        Integer userId = user.getId();
        ExpenseRecord created = recordService.createRecord(userId, recordData);
        ExpenseRecordDTO dto = toDTO(created);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseRecordDTO> updateRecord(
            @PathVariable Integer id,
            @RequestBody ExpenseRecord updatedData,
            HttpSession session) {
        // {
        //    "expenseId": 7,
        //    "user": {
        //        "id": 6,
        //        "username": "bob"
        //    },
        //    "category": {
        //        "id": 9,
        //        "name": "Food"
        //    },
        //    "amount": 320,
        //    "currency": "USD",
        //    "expenseDate": "2025-09-19",
        //    "description": null,
        //    "isRecurring": null,
        //    "recurringScheduleId": null,
        //    "paymentMethod": null
        //}
        UserDTO user = (UserDTO) session.getAttribute("USER");
        Integer userId = user.getId();
        ExpenseRecord updated = recordService.updateRecord(userId, id, updatedData);
        ExpenseRecordDTO dto = toDTO(updated);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRecord(@PathVariable Integer id, HttpSession session) {
        //{
        //    "message": "Record deleted successfully"
        //}
        UserDTO user = (UserDTO) session.getAttribute("USER");
        Integer userId = user.getId();
        recordService.deleteRecord(userId, id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Record deleted successfully");
        return ResponseEntity.ok(response);
    }

    private ExpenseRecordDTO toDTO(ExpenseRecord record) {
        ExpenseRecordDTO dto = new ExpenseRecordDTO();
        dto.setExpenseId(Long.valueOf(record.getExpenseId()));

        // User
        UserDTO userDTO = new UserDTO();
        userDTO.setId(record.getUser().getUser_id());
        userDTO.setUsername(record.getUser().getUsername());
        dto.setUser(userDTO);

        // Category
        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setId(Long.valueOf(record.getCategory().getCategoryId()));
        categoryDTO.setName(record.getCategory().getCategoryName());
        dto.setCategory(categoryDTO);

        dto.setAmount(record.getAmount());
        dto.setCurrency(record.getCurrency());
        dto.setExpenseDate(record.getExpenseDate());
        dto.setDescription(record.getDescription());

        // Recurring
        dto.setIsRecurring(record.getIsRecurring());
        // dto.setRecurringScheduleId(record.getRecurringScheduleId());

        // Transaction Type
        dto.setTransactionType(record.getTransactionType());

        return dto;
    }

    // === Reports ===

    // Weekly
    @GetMapping("/reports/weekly")
    public ResponseEntity<List<ExpenseReportDTO>> getWeeklyReport(
            @RequestParam Integer year,
            @RequestParam Integer week,
            HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("USER");
        Integer userId = user.getId();
        return ResponseEntity.ok(recordService.getWeeklyReport(userId, year, week));
    }

    // Monthly
    @GetMapping("/reports/monthly")
    public ResponseEntity<List<ExpenseReportDTO>> getMonthlyReport(
            @RequestParam Integer year,
            @RequestParam Integer month,
            HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("USER");
        Integer userId = user.getId();
        return ResponseEntity.ok(recordService.getMonthlyReport(userId, year, month));
    }

    // Yearly
    @GetMapping("/reports/yearly")
    public ResponseEntity<List<ExpenseReportDTO>> getYearlyReport(
            @RequestParam Integer year,
            HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("USER");
        Integer userId = user.getId();
        return ResponseEntity.ok(recordService.getYearlyReport(userId, year));
    }

}
