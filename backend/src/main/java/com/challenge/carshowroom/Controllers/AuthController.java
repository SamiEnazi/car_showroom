package com.challenge.carshowroom.Controllers;

import java.time.LocalDateTime;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.challenge.carshowroom.DTOs.AuthRequest;
import com.challenge.carshowroom.DTOs.AuthResponse;
import com.challenge.carshowroom.Models.User;
import com.challenge.carshowroom.Models.UserRole;
import com.challenge.carshowroom.Repositories.UserRepo;
import com.challenge.carshowroom.Security.JwtUtils;
import com.challenge.carshowroom.Security.UserDetailsImpl;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final static Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest loginRequest) {
        // Authenticate the user
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        // Set the authentication in the SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String jwtToken = jwtUtils.generateJwtToken(authentication);

        // Get user details
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Return the response with the token and user details
        return ResponseEntity.ok(new AuthResponse(
                jwtToken,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest registerRequest) {
        // Check if the username is already taken
        Optional<User> existingUser = userRepo.findByUsername(registerRequest.getUsername());
        if (existingUser.isPresent()) {
            logger.error("Exisiting User!", existingUser);
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        // Create a new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passEncoder.encode(registerRequest.getPassword()));
        user.setRole("USER");// Default role for new users
        user.setCreatedAt(LocalDateTime.now());

        // Save the user to the database
        userRepo.save(user);

        // Return a success response
        return ResponseEntity.ok("User registered successfully!");
    }
}