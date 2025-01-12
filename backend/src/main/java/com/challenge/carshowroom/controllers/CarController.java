package com.challenge.carshowroom.controllers;

import com.challenge.carshowroom.dtos.CarDTO;
import com.challenge.carshowroom.models.Car;
import com.challenge.carshowroom.services.CarService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class CarController {

    private static final String PUBLIC_URL = "/public/cars";
    private static final String ADMIN_URL = "/admin/cars";

    @Autowired
    private CarService carService;

    @PostMapping(ADMIN_URL + "/create")
    public ResponseEntity<Car> createCar(@Valid @RequestBody CarDTO carDTO) {
        Car car = carService.createCar(carDTO);
        return ResponseEntity.ok(car);
    }

    @GetMapping(PUBLIC_URL + "/showroom/{showroomId}")
    public ResponseEntity<Page<Car>> getCarsByShowroom(
            @PathVariable Long showroomId,
            Pageable pageable) {
        Page<Car> cars = carService.getCarsByShowroom(showroomId, pageable);
        return ResponseEntity.ok(cars);
    }

    @GetMapping(PUBLIC_URL)
    public ResponseEntity<Page<Car>> getAllCars(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {

        Pageable pageable;
        if (sortBy != null && sortOrder != null) {
            Sort.Direction direction = Sort.Direction.fromString(sortOrder);
            pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        } else {
            pageable = PageRequest.of(page, size);
        }

        Page<Car> cars = carService.getAllCars(pageable);
        return ResponseEntity.ok(cars);
    }

    @PutMapping(ADMIN_URL + "/update/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @Valid @RequestBody CarDTO carDTO) {
        Car car = carService.updateCar(id, carDTO);
        return ResponseEntity.ok(car);
    }

    @DeleteMapping(ADMIN_URL + "/delete/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok().build();
    }

}