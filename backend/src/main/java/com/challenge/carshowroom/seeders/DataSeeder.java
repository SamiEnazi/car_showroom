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
        seedShowroom("Elite Motors", "2468101214", "Manager3", "2468101214", "789 Oak Ave, Village");
        seedShowroom("Supreme Vehicles", "1357924680", "Manager4", "1357924680", "321 Pine Rd, County");
        seedShowroom("Royal Cars", "9876543210", "Manager5", "9876543210", "654 Maple Dr, Borough");
        seedShowroom("Prestige Automobiles", "1122334455", "Manager6", "1122334455", "987 Cedar Ln, District");
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
        // Original cars
        seedCar("VIN123456789", "Toyota", "Camry", 2018, 18000.0, "1234567890",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD10TOC021C021001.jpg&width=350");
        seedCar("VIN987654321", "BMW", "X5", 2025, 60000.0, "0987654321",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD50BMC171A022001.jpg&width=350");

        // Additional cars for Premium Cars showroom
        seedCar("VIN123456790", "Toyota", "RAV4", 2021, 28000.0, "1234567890",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD00TOS112A021001.jpg&width=350");
        seedCar("VIN123456791", "Toyota", "Highlander", 2019, 32000.0, "1234567890",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD30TOS142E021001.jpg&width=350");

        // Additional cars for Luxury Autos showroom
        seedCar("VIN987654322", "BMW", "3 Series", 2020, 35000.0, "0987654321",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD30BMC223A021001.jpg&width=350");
        seedCar("VIN987654323", "BMW", "7 Series", 2024, 85000.0, "0987654321",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD40BMC251A021001.jpg&width=350");

        // Cars for Elite Motors
        seedCar("VIN246810121", "Mercedes-Benz", "C-Class", 2018, 32000.0, "2468101214",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD40MBC891A021001.jpg&width=350");
        seedCar("VIN246810122", "Mercedes-Benz", "E-Class", 2023, 62000.0, "2468101214",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD40MBC681A021001.jpg&width=350");
        seedCar("VIN246810123", "Mercedes-Benz", "GLE", 2025, 68000.0, "2468101214",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD40MBS761A01311.jpg&width=350");

        // Cars for Supreme Vehicles
        seedCar("VIN135792468", "Audi", "A4", 2019, 30000.0, "1357924680",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD00AUC281A021001.jpg&width=350");
        seedCar("VIN135792469", "Audi", "Q5", 2022, 48000.0, "1357924680",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD30AUS021B021001.jpg&width=350");
        seedCar("VIN135792470", "Audi", "e-tron", 2024, 70000.0, "1357924680",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD40AUC401A021001.jpg&width=350");

        // Cars for Royal Cars
        seedCar("VIN987654324", "Lexus", "ES", 2020, 38000.0, "9876543210",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD40LEC161C021001.jpg&width=350");
        seedCar("VIN987654325", "Lexus", "RX", 2023, 55000.0, "9876543210",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD30LES121B021001.jpg&width=350");
        seedCar("VIN987654326", "Lexus", "LS", 2021, 65000.0, "9876543210",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD40LEC372A021001.jpg&width=350");

        // Cars for Prestige Automobiles
        seedCar("VIN112233445", "Porsche", "911", 2019, 85000.0, "1122334455",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD00PRC014A021001.jpg&width=350");
        seedCar("VIN112233446", "Porsche", "Cayenne", 2022, 75000.0, "1122334455",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USC90PRS041A021001_2.jpg&width=350");
        seedCar("VIN112233447", "Porsche", "Taycan", 2025, 95000.0, "1122334455",
                "https://cdcssl.ibsrv.net/autodata/images/?img=USD50PRC202A021001.jpg&width=350");
    }

    private void seedCar(String vin, String maker, String model, int modelYear, double price,
            String showroomRegistrationNumber, String imageUrl) {
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
            car.setImageUrl(imageUrl);
            carRepository.save(car);
            logger.info("Car created: {} {}", maker, model);
        }
    }
}