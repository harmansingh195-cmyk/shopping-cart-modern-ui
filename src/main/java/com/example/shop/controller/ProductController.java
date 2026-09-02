package com.example.shop.controller;

import com.example.shop.model.Product;
import com.example.shop.service.ProductSearchService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final List<Product> PRODUCTS = List.of(
        new Product(1L, "Laptop", 55999, "💻"),
        new Product(2L, "Headphones", 2999, "🎧"),
        new Product(3L, "Keyboard", 1499, "⌨️"),
        new Product(4L, "Mouse", 899, "🖱️")
    );

    private final ProductSearchService productSearchService = new ProductSearchService();

    @GetMapping
    public List<Product> all(@RequestParam(value = "name", required = false) String name) {
        return productSearchService.filterByName(PRODUCTS, name);
    }
}
