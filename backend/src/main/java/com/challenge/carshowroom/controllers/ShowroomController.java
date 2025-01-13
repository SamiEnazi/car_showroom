package com.challenge.carshowroom.controllers;

import com.challenge.carshowroom.dtos.ShowroomDTO;
import com.challenge.carshowroom.models.Showroom;
import com.challenge.carshowroom.services.ShowroomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*") // Configure this according to your security requirements
public class ShowroomController {

    private static final String PUBLIC_URL = "/public/showrooms";
    private static final String ADMIN_URL = "/admin/showrooms";

    @Autowired
    private ShowroomService showroomService;

    @GetMapping(PUBLIC_URL)
    public ResponseEntity<Page<Showroom>> getAllShowrooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {

        Sort sort = Sort.unsorted();
        if (sortBy != null && sortOrder != null) {
            Sort.Direction direction = Sort.Direction.fromString(sortOrder.toUpperCase());
            sort = Sort.by(direction, sortBy);
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Showroom> showrooms = showroomService.getAllShowrooms(pageable);
        return ResponseEntity.ok(showrooms);
    }

    @GetMapping(PUBLIC_URL + "/{id}")
    public ResponseEntity<Showroom> getShowroomById(@PathVariable Long id) {
        Showroom showroom = showroomService.getShowroomById(id);
        return ResponseEntity.ok(showroom);
    }

    @PostMapping(ADMIN_URL + "/create")
    public ResponseEntity<Showroom> createShowroom(@Valid @RequestBody ShowroomDTO showroomDTO) {
        Showroom showroom = showroomService.createShowroom(showroomDTO);
        return ResponseEntity.ok(showroom);
    }

    @PutMapping(ADMIN_URL + "/update/{id}")
    public ResponseEntity<Showroom> updateShowroom(@PathVariable Long id, @Valid @RequestBody ShowroomDTO showroomDTO) {
        Showroom showroom = showroomService.updateShowroom(id, showroomDTO);
        return ResponseEntity.ok(showroom);
    }

    @DeleteMapping(ADMIN_URL + "/delete/{id}")
    public ResponseEntity<Void> deleteShowroom(@PathVariable Long id) {
        try {
            System.out.println("Delete showroom request received for id: " + id);
            showroomService.deleteShowroom(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Error deleting showroom: " + e.getMessage());
            throw e;
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}