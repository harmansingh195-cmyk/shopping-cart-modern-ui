package com.example.shop.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsAllProductsWhenNoSearchQueryIsProvided() throws Exception {
        mockMvc.perform(get("/api/products"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Laptop"))
            .andExpect(jsonPath("$[3].name").value("Mouse"));
    }

    @Test
    void returnsFilteredProductsWhenSearchQueryIsProvided() throws Exception {
        mockMvc.perform(get("/api/products").param("name", "lap"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Laptop"))
            .andExpect(jsonPath("$.length()").value(1));
    }
}
