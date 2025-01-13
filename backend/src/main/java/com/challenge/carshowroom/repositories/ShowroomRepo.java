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

import jakarta.transaction.Transactional;

@Repository
public interface ShowroomRepo extends JpaRepository<Showroom, Long> {
    // Find all active showrooms with pagination
    Page<Showroom> findByDeletedAtIsNull(Pageable pageable);

    // Find active showroom by ID
    Optional<Showroom> findByIdAndDeletedAtIsNull(Long id);

    // Find By
    Optional<Showroom> findByCommercialRegistrationNumber(String crn);

    @Modifying
    @Transactional
    @Query("UPDATE Showroom s SET s.deletedAt = CURRENT_TIMESTAMP WHERE s.id = :id AND s.deletedAt IS NULL")
    void softDeleteById(@Param("id") Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Car c SET c.deletedAt = CURRENT_TIMESTAMP WHERE c.showroom.id = :showroomId AND c.deletedAt IS NULL")
    void softDeleteCarsForShowroom(@Param("showroomId") Long showroomId);

}