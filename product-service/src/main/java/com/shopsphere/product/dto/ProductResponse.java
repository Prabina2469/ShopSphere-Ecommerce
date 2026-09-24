package com.shopsphere.product.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String sku,
        String status,
        String categoryName,
        List<String> imageUrls,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) implements Serializable {}
