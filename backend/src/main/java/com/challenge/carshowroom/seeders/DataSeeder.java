package com.challenge.carshowroom.seeders;

import com.challenge.carshowroom.models.*;
import com.challenge.carshowroom.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    // Constants for test data
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";
    private static final String ADMIN_EMAIL = "admin@admin.com";
    private static final String USER_USERNAME = "user";
    private static final String USER_PASSWORD = "user123";
    private static final String USER_EMAIL = "user@user.com";

    @Autowired
    private CarRepo carRepository;

    @Autowired
    private ShowroomRepo showroomRepository;

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedAdminUser();
        seedNormalUser();
        seedShowrooms();
        seedCars();
        logger.info("Test data seeded successfully!");
    }

    private void seedAdminUser() {
        if (!userRepository.findByUsername(ADMIN_USERNAME).isPresent()) {
            User admin = new User();
            admin.setUsername(ADMIN_USERNAME);
            admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            admin.setEmail(ADMIN_EMAIL);
            admin.setRole("ADMIN");
            userRepository.save(admin);
            logger.info("Admin user created: {}", ADMIN_USERNAME);
        }
    }

    private void seedNormalUser() {
        if (!userRepository.findByUsername(USER_USERNAME).isPresent()) {
            User user = new User();
            user.setUsername(USER_USERNAME);
            user.setPassword(passwordEncoder.encode(USER_PASSWORD));
            user.setEmail(USER_EMAIL);
            user.setRole("USER");
            userRepository.save(user);
            logger.info("Normal user created: {}", USER_USERNAME);
        }
    }

    private void seedShowrooms() {
        seedShowroom("Premium Cars", "1234567890", "Manager1", "1234567890", "123 Main St, City");
        seedShowroom("Luxury Autos", "0987654321", "Manager2", "0987654321", "456 Elm St, Town");
    }

    private void seedShowroom(String name, String commercialRegistrationNumber, String managerName,
            String contactNumber, String address) {
        if (!showroomRepository.findByCommercialRegistrationNumber(commercialRegistrationNumber).isPresent()) {
            Showroom showroom = new Showroom();
            showroom.setName(name);
            showroom.setCommercialRegistrationNumber(commercialRegistrationNumber);
            showroom.setContactNumber(contactNumber);
            showroom.setManagerName(managerName);
            showroom.setAddress(address);
            showroomRepository.save(showroom);
            logger.info("Showroom created: {}", name);
        }
    }

    private void seedCars() {
        seedCar("VIN123456789", "Toyota", "Camry", 2022, 25000.0, "1234567890");
        seedCar("VIN987654321", "BMW", "X5", 2023, 60000.0, "0987654321");
    }

    private void seedCar(String vin, String maker, String model, int modelYear, double price,
            String showroomRegistrationNumber) {
        if (!carRepository.findByVin(vin).isPresent()) {
            Showroom showroom = showroomRepository.findByCommercialRegistrationNumber(showroomRegistrationNumber)
                    .orElseThrow(() -> new RuntimeException("Showroom not found: " + showroomRegistrationNumber));

            Car car = new Car();
            car.setVin(vin);
            car.setMaker(maker);
            car.setModel(model);
            car.setModelYear(modelYear);
            car.setPrice(price);
            car.setShowroom(showroom);
            carRepository.save(car);
            logger.info("Car created: {} {}", maker, model);
        }
    }
}