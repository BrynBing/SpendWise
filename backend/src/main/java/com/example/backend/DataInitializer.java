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
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            ExpenseRecordRepository expenseRecordRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // --- Initialization Category ---
            if (categoryRepository.count() == 0) {
                Category food = new Category(null, "Food", "All food and dining expenses", null, null);
                Category transport = new Category(null, "Transport", "Bus, train, taxi etc.", null, null);
                Category entertainment = new Category(null, "Entertainment", "Movies, games, events", null, null);
                Category shopping = new Category(null, "Shopping", "Clothes, electronics, goods", null, null);
                Category utilities = new Category(null, "Utilities", "Electricity, water, internet", null, null);

                categoryRepository.save(food);
                categoryRepository.save(transport);
                categoryRepository.save(entertainment);
                categoryRepository.save(shopping);
                categoryRepository.save(utilities);

                System.out.println("Categories initialized");
            }

            // --- Initialize User ---
            if (userRepository.count() == 0) {
                User user1 = new User();
                user1.setUsername("User1");
                user1.setEmail("User1@example.com");
                user1.setPassword_hash(passwordEncoder.encode("password"));
                userRepository.save(user1);

                User user2 = new User();
                user2.setUsername("User2");
                user2.setEmail("User2@example.com");
                user2.setPassword_hash(passwordEncoder.encode("password"));
                userRepository.save(user2);

                System.out.println("Users initialized");
            }

            // --- Initialize ExpenseRecord ---
            if (expenseRecordRepository.count() == 0) {
                // Take the existing category and user
                Category food = categoryRepository.findBycategoryName("Food");
                Category transport = categoryRepository.findBycategoryName("Transport");
                User alice = userRepository.findByUsernameOrEmail("User1", "User1@example.com");
                User bob = userRepository.findByUsernameOrEmail("User2", "User2@example.com");

                ExpenseRecord record1 = new ExpenseRecord();
                record1.setUser(alice);
                record1.setCategory(food);
                record1.setAmount(new BigDecimal("12.50"));
                record1.setCurrency("USD");
                record1.setExpenseDate(LocalDate.now());
                record1.setDescription("Lunch at cafe");
                expenseRecordRepository.save(record1);

                ExpenseRecord record2 = new ExpenseRecord();
                record2.setUser(bob);
                record2.setCategory(transport);
                record2.setAmount(new BigDecimal("3.20"));
                record2.setCurrency("USD");
                record2.setExpenseDate(LocalDate.now());
                record2.setDescription("Bus ticket");
                expenseRecordRepository.save(record2);

                System.out.println("Expense records initialized");
            }
        };
    }
}
