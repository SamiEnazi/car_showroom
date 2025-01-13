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
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController

@CrossOrigin(origins = "*") // Configure this according to your security requirements
public class CarController {

    private static final String PUBLIC_URL = "/public/cars";
    private static final String ADMIN_URL = "/admin/cars";

    @Autowired
    private CarService carService;

    @GetMapping(PUBLIC_URL)
    public ResponseEntity<Page<Car>> getAllCars(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Long showroomId) {

        Sort sort = Sort.unsorted();
        if (sortBy != null && sortOrder != null) {
            Sort.Direction direction = Sort.Direction.fromString(sortOrder.toUpperCase());
            sort = Sort.by(direction, sortBy);
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Car> cars = carService.getAllCars(pageable, minPrice, maxPrice, showroomId);
        return ResponseEntity.ok(cars);
    }

    @GetMapping(PUBLIC_URL + "/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        Car car = carService.getCarById(id);
        return ResponseEntity.ok(car);
    }

    @PostMapping(ADMIN_URL + "/create")
    public ResponseEntity<Car> createCar(@Valid @RequestBody CarDTO carDTO) {
        Car car = carService.createCar(carDTO);
        return ResponseEntity.ok(car);
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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}