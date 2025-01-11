package com.challenge.carshowroom.dtos;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShowroomDTO {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    @NotBlank(message = "Commercial registration number is required")
    @Size(min = 10, max = 10, message = "Commercial registration number must be 10 digits")
    private String commercialRegistrationNumber;

    @Size(max = 100, message = "Manager name must be less than 100 characters")
    private String managerName;

    @NotBlank(message = "Contact number is required")
    @Size(max = 15, message = "Contact number must be less than 15 digits")
    private String contactNumber;

    @Size(max = 255, message = "Address must be less than 255 characters")
    private String address;

    // @Size(max = 255, message = "Image URL must be less than 255 characters")
    private String imageUrl;
}