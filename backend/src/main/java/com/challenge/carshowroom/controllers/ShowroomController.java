package com.challenge.carshowroom.controllers;

import com.challenge.carshowroom.dtos.ShowroomDTO;
import com.challenge.carshowroom.models.Showroom;
import com.challenge.carshowroom.repositories.ShowroomRepo;
import com.challenge.carshowroom.services.ShowroomService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/showrooms")
public class ShowroomController {

    @Autowired
    private ShowroomService showroomService;

    @PostMapping
    public ResponseEntity<Showroom> createShowroom(@RequestBody ShowroomDTO showroomDTO) {
        Showroom showroom = showroomService.createShowroom(showroomDTO);
        return ResponseEntity.ok(showroom);
    }

    @GetMapping
    public ResponseEntity<Page<Showroom>> getAllShowrooms(Pageable pageable) {
        Page<Showroom> showrooms = showroomService.getAllShowrooms(pageable);
        return ResponseEntity.ok(showrooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Showroom> getShowroomById(@PathVariable Long id) {
        Showroom showroom = showroomService.getShowroomById(id);
        return ResponseEntity.ok(showroom);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Showroom> updateShowroom(@PathVariable Long id, @RequestBody ShowroomDTO showroomDTO) {
        Showroom showroom = showroomService.updateShowroom(id, showroomDTO);
        return ResponseEntity.ok(showroom);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowroom(@PathVariable Long id) {
        showroomService.deleteShowroom(id);
        return ResponseEntity.noContent().build();
    }
}