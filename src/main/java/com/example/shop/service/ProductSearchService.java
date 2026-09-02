package com.example.shop.service;

import com.example.shop.model.Product;
import java.util.List;
import java.util.Locale;

public class ProductSearchService {

    public List<Product> filterByName(List<Product> products, String query) {
        if (products == null) {
            return List.of();
        }

        String normalizedQuery = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
        if (normalizedQuery.isEmpty()) {
            return List.copyOf(products);
        }

        return products.stream()
            .filter(product -> product != null && product.name() != null)
            .filter(product -> product.name().toLowerCase(Locale.ROOT).contains(normalizedQuery))
            .toList();
    }
}
