package com.example.shop.service;

import com.example.shop.model.Product;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ProductSearchServiceTest {

    private final ProductSearchService service = new ProductSearchService();

    @Test
    void returnsAllProductsWhenQueryIsEmpty() {
        List<Product> products = List.of(
            new Product(1L, "Laptop", 55999, "💻"),
            new Product(2L, "Headphones", 2999, "🎧")
        );

        List<Product> result = service.filterByName(products, " ");

        assertEquals(products, result);
    }

    @Test
    void filtersProductsCaseInsensitivelyByName() {
        List<Product> products = List.of(
            new Product(1L, "Laptop", 55999, "💻"),
            new Product(2L, "Headphones", 2999, "🎧"),
            new Product(3L, "Keyboard", 1499, "⌨️")
        );

        List<Product> result = service.filterByName(products, "KEY");

        assertEquals(List.of(products.get(2)), result);
    }

    @Test
    void returnsNoProductsWhenNoNameMatches() {
        List<Product> products = List.of(
            new Product(1L, "Laptop", 55999, "💻"),
            new Product(2L, "Headphones", 2999, "🎧")
        );

        List<Product> result = service.filterByName(products, "chair");

        assertTrue(result.isEmpty());
    }

    @Test
    void handlesNullListAndNullQuery() {
        assertTrue(service.filterByName(null, null).isEmpty());
    }
}
