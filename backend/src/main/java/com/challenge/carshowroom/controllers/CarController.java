package com.challenge.carshowroom.controllers;

import com.challenge.carshowroom.dtos.CarDTO;
import com.challenge.carshowroom.models.Car;
import com.challenge.carshowroom.services.CarService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @PostMapping
    public ResponseEntity<Car> createCar(@RequestBody CarDTO carDTO) {
        Car car = carService.createCar(carDTO);
        return ResponseEntity.ok(car);
    }

    @GetMapping("/showroom/{showroomId}")
    public ResponseEntity<Page<Car>> getCarsByShowroom(
            @PathVariable Long showroomId,
            Pageable pageable) {
        Page<Car> cars = carService.getCarsByShowroom(showroomId, pageable);
        return ResponseEntity.ok(cars);
    }

    @GetMapping
    public ResponseEntity<Page<Car>> getAllCars(Pageable pageable) {
        Page<Car> cars = carService.getAllCars(pageable);
        return ResponseEntity.ok(cars);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody CarDTO carDTO) {
        Car car = carService.updateCar(id, carDTO);
        return ResponseEntity.ok(car);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }

}