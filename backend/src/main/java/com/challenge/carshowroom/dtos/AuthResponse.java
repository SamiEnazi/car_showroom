package com.challenge.carshowroom.dtos;

public class AuthResponse {
    private String token;
    private Long id;
    private String username;

    public AuthResponse(String token, Long id, String username) {
        this.token = token;
        this.id = id;
        this.username = username;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}