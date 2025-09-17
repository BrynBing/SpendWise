package com.example.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DevDataSeeder {

    @Bean
    CommandLineRunner seedUser(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            var existed = repo.findByUsernameOrEmail("bob", "bob@example.com");
            if (existed == null) {
                User u = new User();
                u.setUsername("bob");
                u.setEmail("bob@example.com");
                u.setPassword_hash(encoder.encode("abc12345"));
                repo.save(u);
                System.out.println("Seeded user bob / bob@example.com with password abc12345");
            }
        };
    }
}