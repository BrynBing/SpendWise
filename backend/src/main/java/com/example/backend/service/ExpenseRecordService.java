package com.example.backend.service;

import com.example.backend.dto.ExpenseReportDTO;
import com.example.backend.model.Category;
import com.example.backend.model.ExpenseRecord;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ExpenseRecordRepository;
import com.example.backend.repository.UserRepository;
import com.lowagie.text.Chunk;
import com.lowagie.text.Paragraph;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import com.lowagie.text.Document;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.PdfPTable;
import java.io.ByteArrayOutputStream;

@Service
public class ExpenseRecordService {

    private final ExpenseRecordRepository expenseRecordRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public ExpenseRecordService(ExpenseRecordRepository expenseRecordRepository, UserRepository userRepository,
            CategoryRepository categoryRepository) {
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

        // Try to find category by ID first, then by name
        Category category;
        if (recordData.getCategory().getCategoryId() != null) {
            category = categoryRepository.findById(recordData.getCategory().getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        } else if (recordData.getCategory().getCategoryName() != null) {
            category = categoryRepository.findBycategoryName(recordData.getCategory().getCategoryName());
            if (category == null) {
                throw new RuntimeException("Category not found: " + recordData.getCategory().getCategoryName());
            }
        } else {
            throw new RuntimeException("Category ID or name must be provided");
        }

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

        if (updatedData.getAmount() != null)
            existing.setAmount(updatedData.getAmount());
        if (updatedData.getCurrency() != null)
            existing.setCurrency(updatedData.getCurrency());
        if (updatedData.getDescription() != null)
            existing.setDescription(updatedData.getDescription());
        if (updatedData.getNotes() != null)
            existing.setNotes(updatedData.getNotes());
        if (updatedData.getPaymentMethod() != null)
            existing.setPaymentMethod(updatedData.getPaymentMethod());
        if (updatedData.getIsRecurring() != null)
            existing.setIsRecurring(updatedData.getIsRecurring());
        if (updatedData.getTransactionType() != null)
            existing.setTransactionType(updatedData.getTransactionType());

        // Handle category update
        if (updatedData.getCategory() != null) {
            Category category;
            if (updatedData.getCategory().getCategoryId() != null) {
                category = categoryRepository.findById(updatedData.getCategory().getCategoryId())
                        .orElseThrow(() -> new RuntimeException("Category not found"));
            } else if (updatedData.getCategory().getCategoryName() != null) {
                category = categoryRepository.findBycategoryName(updatedData.getCategory().getCategoryName());
                if (category == null) {
                    throw new RuntimeException("Category not found: " + updatedData.getCategory().getCategoryName());
                }
            } else {
                category = null;
            }
            if (category != null) {
                existing.setCategory(category);
            }
        }

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

    // === Weekly Report ===
    public List<ExpenseReportDTO> getWeeklyReport(Integer userId, Integer year, Integer week) {
        return expenseRecordRepository.getWeeklyReportFor(userId, year, week);
    }

    // === Monthly Report ===
    public List<ExpenseReportDTO> getMonthlyReport(Integer userId, Integer year, Integer month) {
        return expenseRecordRepository.getMonthlyReportFor(userId, year, month);
    }

    // === Yearly Report ===
    public List<ExpenseReportDTO> getYearlyReport(Integer userId, Integer year) {
        return expenseRecordRepository.getYearlyReportFor(userId, year);
    }

    public byte[] exportReportPdf(Integer userId, String period, Integer year, Integer month, Integer week) {
        List<ExpenseReportDTO> reports;

        switch (period.toLowerCase()) {
            case "weekly" -> {
                if (year == null || week == null) {
                    throw new IllegalArgumentException("Year and week are required for weekly reports.");
                }
                reports = expenseRecordRepository.getWeeklyReportFor(userId, year, week);
            }
            case "monthly" -> {
                if (year == null || month == null) {
                    throw new IllegalArgumentException("Year and month are required for monthly reports.");
                }
                reports = expenseRecordRepository.getMonthlyReportFor(userId, year, month);
            }
            case "yearly" -> {
                if (year == null) {
                    throw new IllegalArgumentException("Year is required for yearly reports.");
                }
                reports = expenseRecordRepository.getYearlyReportFor(userId, year);
            }
            default -> throw new IllegalArgumentException("Invalid period: " + period);
        }

        // Generate PDF
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph(period.toUpperCase() + " Expense Report"));
            document.add(new Paragraph("Year: " + year +
                    (month != null ? ", Month: " + month : "") +
                    (week != null ? ", Week: " + week : "")));
            document.add(new Paragraph("Generated on: " + java.time.LocalDate.now()));
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(4);
            table.addCell("Year");
            table.addCell("Period");
            table.addCell("Category");
            table.addCell("Amount");

            double total = 0.0;
            for (ExpenseReportDTO r : reports) {
                table.addCell(String.valueOf(r.getYear()));
                table.addCell(r.getPeriodValue() == null ? "-" : String.valueOf(r.getPeriodValue()));
                table.addCell(r.getCategoryName());
                table.addCell(r.getTotalAmount().toString());
                total += r.getTotalAmount().doubleValue();
            }

            // Add total row
            table.addCell("");
            table.addCell("");
            table.addCell("Total");
            table.addCell(String.valueOf(total));

            document.add(table);
            document.close();

            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

}