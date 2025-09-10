package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/signin")
public class SigninController {

    @Autowired
    private UserRepository userRepository;

    public SigninController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
//
//    @PostMapping
//    public String signin(@RequestParam String username, @RequestParam String password) {
//        User user = userRepository.findByUsername(username);
//        if (user != null && user.getPassword_hash().equals(password)) {
//            return "Signin successful";
//        } else {
//            return "Signin failed";
//        }
//    }

    @GetMapping("/test-db")
    public List<User> testDb() {
        return userRepository.findAll();
    }

}
