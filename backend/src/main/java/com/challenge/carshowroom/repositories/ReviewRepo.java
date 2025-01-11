package com.challenge.carshowroom.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.challenge.carshowroom.models.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewRepo extends JpaRepository<Review, Long> {
    // Find reviews by car ID (only active reviews)
    List<Review> findByCarIdAndDeletedAtIsNull(Long carId);

    // Find all active reviews with pagination
    Page<Review> findByDeletedAtIsNull(Pageable pageable);

    // Find active review by ID
    Optional<Review> findByIdAndDeletedAtIsNull(Long id);
}