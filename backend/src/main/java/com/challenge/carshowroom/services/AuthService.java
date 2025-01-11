package com.challenge.carshowroom.services;

import com.challenge.carshowroom.dtos.AuthRequest;
import com.challenge.carshowroom.dtos.AuthResponse;
import com.challenge.carshowroom.models.User;
import com.challenge.carshowroom.repositories.UserRepo;
import com.challenge.carshowroom.security.JwtUtils;
import com.challenge.carshowroom.security.UserDetailsImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service()
public class AuthService {

    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passEncoder;
    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse login(AuthRequest authReq) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(authReq.getUsername(), authReq.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(auth);
        String jwt = jwtUtils.generateJwtToken(auth);
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        return new AuthResponse(jwt, userDetails.getId(), userDetails.getUsername());
    }

    public String register(AuthRequest authReq) {
        if (userRepo.findByUsername(authReq.getUsername()) != null) {
            return "Error: Username is Already taken!";
        }

        User user = new User();
        user.setUsername(authReq.getUsername());
        user.setPassword(passEncoder.encode(authReq.getPassword()));
        // the role is USER by default :)
        return "User registered successfully!";
    }

}
