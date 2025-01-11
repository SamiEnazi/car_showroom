package com.challenge.carshowroom.services;

import com.challenge.carshowroom.dtos.CarDTO;
import com.challenge.carshowroom.models.Car;
import com.challenge.carshowroom.models.Showroom;
import com.challenge.carshowroom.repositories.CarRepo;
import com.challenge.carshowroom.repositories.ShowroomRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {

    @Autowired
    private CarRepo carRepository;

    @Autowired
    private ShowroomRepo showroomRepository;

    // Create a new car
    public Car createCar(CarDTO carDTO) {
        Showroom showroom = showroomRepository.findById(carDTO.getShowroomId())
                .orElseThrow(() -> new RuntimeException("Showroom not found"));

        Car car = new Car();
        car.setVin(carDTO.getVin());
        car.setMaker(carDTO.getMaker());
        car.setModel(carDTO.getModel());
        car.setModelYear(carDTO.getModelYear());
        car.setPrice(carDTO.getPrice());
        car.setShowroom(showroom);

        return carRepository.save(car);
    }

    public Page<Car> getCarsByShowroom(Long showroomId, Pageable pageable) {
        return carRepository.findByShowroomIdAndDeletedAtIsNull(showroomId, pageable);
    }

    public Page<Car> getAllCars(Pageable pageable) {
        return carRepository.findByDeletedAtIsNull(pageable);
    }

    // Update a car
    public Car updateCar(Long id, CarDTO carDTO) {
        Car car = carRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        car.setVin(carDTO.getVin());
        car.setMaker(carDTO.getMaker());
        car.setModel(carDTO.getModel());
        car.setModelYear(carDTO.getModelYear());
        car.setPrice(carDTO.getPrice());

        return carRepository.save(car);
    }

    // Soft delete a car
    public void deleteCar(Long id) {
        carRepository.softDeleteById(id);
    }
}