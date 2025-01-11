package com.challenge.carshowroom.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.challenge.carshowroom.models.User;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    // Find active users (not soft-deleted)
    Optional<User> findByIdAndDeletedAtIsNull(Long id);

    // Find all active users with pagination
    Page<User> findByDeletedAtIsNull(Pageable pageable);
}
