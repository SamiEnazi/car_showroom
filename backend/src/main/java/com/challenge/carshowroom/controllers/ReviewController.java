package com.challenge.carshowroom.controllers;

import com.challenge.carshowroom.models.Review;
import com.challenge.carshowroom.services.ReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public Review createReview(@RequestBody Review review) {
        return reviewService.createReview(review);
    }

    @GetMapping("/car/{carId}")
    public List<Review> getReviewsByCar(@PathVariable Long carId) {
        return reviewService.getReviewsByCar(carId);
    }
}