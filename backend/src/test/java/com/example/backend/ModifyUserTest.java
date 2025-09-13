package com.example.backend;

import com.example.backend.model.User;
import com.example.backend.service.ModifyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ModifyUserTest {

    private final ModifyService userService;
    private final MockMvc mockMvc;

    @Autowired
    public ModifyUserTest(ModifyService userService, MockMvc mockMvc) {
        this.userService = userService;
        this.mockMvc = mockMvc;
    }

    @Test
    public void testUpdateUserViaApi() throws Exception {
        User originalUser = new User();
        originalUser.setUsername("originalName");
        originalUser.setEmail("original@example.com");
        originalUser = userService.updateUser(1, originalUser); // 或使用 repository 保存

        String updatedJson = """
            {
                "username": "newname",
                "email": "newemail@example.com",
                "phone_number": "123456789"
            }
            """;

        mockMvc.perform(
                        put("/api/users/{id}", originalUser.getUser_id())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(updatedJson)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newname"))
                .andExpect(jsonPath("$.email").value("newemail@example.com"));

        User updatedUser = userService.updateUser(originalUser.getUser_id(), originalUser);
        System.out.println(updatedUser);
    }
}


