package com.challenge.carshowroom.Models;

public enum UserRole {
    USER, ADMIN;

    public String toAuthority() {
        return "ROLE_" + this.name();
    }
}
