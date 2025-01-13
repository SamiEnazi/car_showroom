package com.challenge.carshowroom.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;

@Entity
@Table(name = "cars", schema = "car_showroom_db")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Column(name = "id")
    private Long id;

    @Column(nullable = false, unique = true, name = "vin", length = 25)
    @Getter
    @Setter
    private String vin;

    @Column(nullable = false, name = "maker", length = 25)
    @Getter
    @Setter
    private String maker;

    @Column(nullable = false, name = "model", length = 25)
    @Getter
    @Setter
    private String model;

    @Column(nullable = false, name = "model_year")
    @Getter
    @Setter
    private int modelYear;

    @Column(nullable = false, name = "price")
    @Getter
    @Setter
    private double price;

    @Column(name = "image_url", columnDefinition = "TEXT")
    @Getter
    @Setter
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_id", nullable = false)
    @JsonBackReference
    @Getter
    @Setter
    private Showroom showroom;

    @Column(name = "created_at")
    @Getter
    @Setter
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    @Getter
    @Setter
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}