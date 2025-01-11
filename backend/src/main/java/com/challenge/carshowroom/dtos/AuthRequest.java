package com.challenge.carshowroom.dtos;

import lombok.Getter;
import lombok.Setter;

public class AuthRequest {
    @Getter
    @Setter
    private String username;
    @Getter
    @Setter
    private String password;
    @Getter
    @Setter
    private String email;
}