package com.challenge.carshowroom.dtos;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewDTO {

    @NotBlank(message = "Comment is required")
    @Size(max = 500, message = "Comment must be less than 500 characters")
    private String comment;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private int rating;
    private Long carId;
    private Long showroomId;
}