package com.challenge.carshowroom.Services;

import com.challenge.carshowroom.DTOs.AuthRequest;
import com.challenge.carshowroom.DTOs.AuthResponse;
import com.challenge.carshowroom.Models.User;
import com.challenge.carshowroom.Repositories.UserRepo;
import com.challenge.carshowroom.Security.JwtUtils;
import com.challenge.carshowroom.Security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
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
