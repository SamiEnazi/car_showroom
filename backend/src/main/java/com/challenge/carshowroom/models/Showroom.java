package com.challenge.carshowroom.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "showrooms", schema = "car_showroom_db")
public class Showroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Column(name = "id")
    private Long id;

    @Column(nullable = false, name = "name", length = 100)
    @Getter
    @Setter
    private String name;

    @Column(nullable = false, unique = true, name = "commercial_registration_number", length = 10)
    @Getter
    @Setter
    private String commercialRegistrationNumber;

    @Column(name = "manager_name", length = 100)
    @Getter
    @Setter
    private String managerName;

    @Column(nullable = false, name = "contact_number", length = 15)
    @Getter
    @Setter
    private String contactNumber;

    @Column(name = "address", length = 255)
    @Getter
    @Setter
    private String address;

    @Column(name = "image_url", columnDefinition = "TEXT")
    @Getter
    @Setter
    private String imageUrl;

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