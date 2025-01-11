package com.challenge.carshowroom.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
// import java.util.List;s
import org.springframework.stereotype.Repository;

import com.challenge.carshowroom.models.Showroom;

@Repository
public interface ShowroomRepo extends JpaRepository<Showroom, Long> {
    // Find all active showrooms with pagination
    Page<Showroom> findByDeletedAtIsNull(Pageable pageable);

    // Find active showroom by ID
    Optional<Showroom> findByIdAndDeletedAtIsNull(Long id);

    // Find By
    Optional<Showroom> findByCommercialRegistrationNumber(String crn);

    // Soft delete a showroom by setting deleted_at to the current timestamp
    @Modifying
    @Query("UPDATE Showroom s SET s.deletedAt = CURRENT_TIMESTAMP WHERE s.id = :id")
    void softDeleteById(@Param("id") Long id);

}