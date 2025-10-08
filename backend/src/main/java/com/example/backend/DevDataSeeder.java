package com.example.backend;

import com.example.backend.model.Category;
import com.example.backend.model.ExpenseRecord;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ExpenseRecordRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DevDataSeeder {

    @Bean
    CommandLineRunner initData(
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            ExpenseRecordRepository expenseRecordRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // --- Initialization Category ---
            if (categoryRepository.count() == 0) {
                // Expense categories
                Category groceries = new Category(null, "Groceries", "Food and groceries shopping", null, null);
                Category transport = new Category(null, "Transport", "Bus, train, taxi etc.", null, null);
                Category housing = new Category(null, "Housing", "Rent, mortgage, property expenses", null, null);
                Category utilities = new Category(null, "Utilities", "Electricity, water, internet", null, null);
                Category entertainment = new Category(null, "Entertainment", "Movies, games, events", null, null);
                Category healthcare = new Category(null, "Healthcare", "Medical, dental, health insurance", null, null);
                Category diningOut = new Category(null, "Dining Out", "Restaurants, cafes, takeout", null, null);
                Category shopping = new Category(null, "Shopping", "Clothes, electronics, goods", null, null);
                Category other = new Category(null, "Other", "Miscellaneous expenses", null, null);
                
                // Income categories
                Category salary = new Category(null, "Salary", "Regular employment income", null, null);
                Category freelance = new Category(null, "Freelance", "Freelance work and contracts", null, null);
                Category investments = new Category(null, "Investments", "Investment returns and dividends", null, null);
                Category gift = new Category(null, "Gift", "Gifts and monetary presents", null, null);
                Category refund = new Category(null, "Refund", "Refunds and reimbursements", null, null);

                categoryRepository.save(groceries);
                categoryRepository.save(transport);
                categoryRepository.save(housing);
                categoryRepository.save(utilities);
                categoryRepository.save(entertainment);
                categoryRepository.save(healthcare);
                categoryRepository.save(diningOut);
                categoryRepository.save(shopping);
                categoryRepository.save(other);
                categoryRepository.save(salary);
                categoryRepository.save(freelance);
                categoryRepository.save(investments);
                categoryRepository.save(gift);
                categoryRepository.save(refund);

                System.out.println("Categories initialized (14 categories)");
            }

            // --- Initialize bob User ---
            User bob = userRepository.findByUsernameOrEmail("bob", "bob@example.com");
            if (bob == null) {
                bob = new User();
                bob.setUsername("bob");
                bob.setEmail("bob@example.com");
                bob.setPassword_hash(passwordEncoder.encode("abc12345"));
                userRepository.save(bob);
                System.out.println("User bob initialized");
            }

            // --- Initialize ExpenseRecord for bob ---
            if (expenseRecordRepository.count() == 0) {
                Category groceries = categoryRepository.findBycategoryName("Groceries");
                Category transport = categoryRepository.findBycategoryName("Transport");
                Category salary = categoryRepository.findBycategoryName("Salary");

                ExpenseRecord record1 = new ExpenseRecord();
                record1.setUser(bob);
                record1.setCategory(groceries);
                record1.setAmount(new BigDecimal("12.50"));
                record1.setCurrency("USD");
                record1.setExpenseDate(LocalDate.now());
                record1.setDescription("Grocery shopping");
                record1.setTransactionType("expense");
                expenseRecordRepository.save(record1);

                ExpenseRecord record2 = new ExpenseRecord();
                record2.setUser(bob);
                record2.setCategory(transport);
                record2.setAmount(new BigDecimal("3.20"));
                record2.setCurrency("USD");
                record2.setExpenseDate(LocalDate.now());
                record2.setDescription("Bus ticket");
                record2.setTransactionType("expense");
                expenseRecordRepository.save(record2);

                ExpenseRecord record3 = new ExpenseRecord();
                record3.setUser(bob);
                record3.setCategory(salary);
                record3.setAmount(new BigDecimal("5000.00"));
                record3.setCurrency("USD");
                record3.setExpenseDate(LocalDate.now());
                record3.setDescription("Monthly salary");
                record3.setTransactionType("income");
                expenseRecordRepository.save(record3);

                System.out.println("Expense records for bob initialized (2 expenses, 1 income)");
            }
        };
    }
}
