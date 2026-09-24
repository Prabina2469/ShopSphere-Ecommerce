package com.shopsphere.product.repository;

import com.shopsphere.product.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

/**
 * Composable JPA Specifications used to build the dynamic
 * GET /api/products?category=&minPrice=&maxPrice=&keyword= filter query.
 */
public class ProductSpecifications {

    public static Specification<Product> hasCategory(String categoryName) {
        return (root, query, cb) -> categoryName == null ? null :
                cb.equal(cb.lower(root.join("category").get("name")), categoryName.toLowerCase());
    }

    public static Specification<Product> minPrice(BigDecimal min) {
        return (root, query, cb) -> min == null ? null : cb.greaterThanOrEqualTo(root.get("price"), min);
    }

    public static Specification<Product> maxPrice(BigDecimal max) {
        return (root, query, cb) -> max == null ? null : cb.lessThanOrEqualTo(root.get("price"), max);
    }

    public static Specification<Product> keyword(String keyword) {
        return (root, query, cb) -> keyword == null ? null :
                cb.or(
                        cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("description")), "%" + keyword.toLowerCase() + "%")
                );
    }
}
