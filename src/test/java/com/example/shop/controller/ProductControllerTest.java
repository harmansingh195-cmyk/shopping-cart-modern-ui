package com.example.shop.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Regression tests for the existing {@code GET /api/products} endpoint.
 *
 * <p>The Product Search Box story (EPMCDMETST-62766) is implemented entirely
 * client-side in {@code index.html} and must not introduce any new endpoint,
 * request, or change to the shape of this API response (FR6/FR7, NFR2, AC9).
 * These tests pin down the current, unchanged contract.</p>
 */
@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsAllProductsWithExpectedShapeAndOrder() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Laptop"))
                .andExpect(jsonPath("$[0].price").value(55999))
                .andExpect(jsonPath("$[1].name").value("Headphones"))
                .andExpect(jsonPath("$[2].name").value("Keyboard"))
                .andExpect(jsonPath("$[3].name").value("Mouse"));
    }
}
