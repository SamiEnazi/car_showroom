package com.challenge.carshowroom.dtos;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarDTO {

    @NotBlank(message = "VIN is required")
    @Size(max = 25, message = "VIN must be less than 25 characters")
    private String vin;

    @NotBlank(message = "Maker is required")
    @Size(max = 25, message = "Maker must be less than 25 characters")
    private String maker;

    @NotBlank(message = "Model is required")
    @Size(max = 25, message = "Model must be less than 25 characters")
    private String model;

    @NotNull(message = "Model year is required")
    @Min(value = 1900, message = "Model year must be after 1900")
    @Max(value = 2026, message = "Model year must be before 2026")
    private int modelYear;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be a positive value")
    private double price;

    @NotNull(message = "Showroom ID is required")
    private Long showroomId;
}