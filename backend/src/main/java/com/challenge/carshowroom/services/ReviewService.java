package com.challenge.carshowroom.services;

import com.challenge.carshowroom.models.Review;
import com.challenge.carshowroom.repositories.ReviewRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepo reviewRepo;

    public Review createReview(Review review) {
        return reviewRepo.save(review);
    }

    public List<Review> getReviewsByCar(Long carId) {
        return reviewRepo.findByCarIdAndDeletedAtIsNull(carId);
    }
}