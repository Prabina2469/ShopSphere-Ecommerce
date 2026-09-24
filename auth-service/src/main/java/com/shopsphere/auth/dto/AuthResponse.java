package com.shopsphere.auth.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long userId,
        String name,
        String email,
        String role
) {
    public static AuthResponse of(String accessToken, String refreshToken, Long userId,
                                   String name, String email, String role) {
        return new AuthResponse(accessToken, refreshToken, "Bearer", userId, name, email, role);
    }
}
