package com.challenge.carshowroom.models;

public enum UserRole {
    USER, ADMIN;

    public String toAuthority() {
        return "ROLE_" + this.name();
    }
}
