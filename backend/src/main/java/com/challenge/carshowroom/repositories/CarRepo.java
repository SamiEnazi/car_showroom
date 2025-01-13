package com.challenge.carshowroom.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.challenge.carshowroom.models.Car;

import java.util.List;
import java.util.Optional;

public interface CarRepo extends JpaRepository<Car, Long>, JpaSpecificationExecutor<Car> {
    // Find all cars by showroom ID (only active cars)

    Page<Car> findByShowroomIdAndDeletedAtIsNull(Long showroomId, Pageable pageable);

    // Find a car by ID (only active cars)
    Optional<Car> findByIdAndDeletedAtIsNull(Long id);

    Optional<Car> findByVin(String vin);

    Page<Car> findByDeletedAtIsNull(Pageable pageable);

    // Soft delete a car
    @Modifying
    @Query("UPDATE Car c SET c.deletedAt = CURRENT_TIMESTAMP WHERE c.id = :id")
    void softDeleteById(@Param("id") Long id);
}