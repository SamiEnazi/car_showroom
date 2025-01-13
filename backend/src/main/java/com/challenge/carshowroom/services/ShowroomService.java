package com.challenge.carshowroom.services;

import com.challenge.carshowroom.dtos.ShowroomDTO;
import com.challenge.carshowroom.models.Showroom;
import com.challenge.carshowroom.repositories.ShowroomRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ShowroomService {

    @Autowired
    private ShowroomRepo showroomRepository;

    public Showroom createShowroom(ShowroomDTO showroomDTO) {
        Showroom showroom = new Showroom();
        showroom.setName(showroomDTO.getName());
        showroom.setCommercialRegistrationNumber(showroomDTO.getCommercialRegistrationNumber());
        showroom.setManagerName(showroomDTO.getManagerName());
        showroom.setContactNumber(showroomDTO.getContactNumber());
        showroom.setAddress(showroomDTO.getAddress());

        return showroomRepository.save(showroom);
    }

    public Page<Showroom> getAllShowrooms(Pageable pageable) {
        return showroomRepository.findByDeletedAtIsNull(pageable);
    }

    public Showroom getShowroomById(Long id) {
        return showroomRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Showroom not found"));
    }

    public Showroom updateShowroom(Long id, ShowroomDTO showroomDTO) {
        Showroom showroom = showroomRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Showroom not found"));

        showroom.setName(showroomDTO.getName());
        showroom.setManagerName(showroomDTO.getManagerName());
        showroom.setContactNumber(showroomDTO.getContactNumber());
        showroom.setAddress(showroomDTO.getAddress());

        return showroomRepository.save(showroom);
    }

    @Transactional
    public void deleteShowroom(Long id) {
        Optional<Showroom> showroom = showroomRepository.findByIdAndDeletedAtIsNull(id);
        if (showroom.isEmpty()) {
            throw new RuntimeException("Showroom not found");
        }
        showroomRepository.softDeleteCarsForShowroom(id);
        showroomRepository.softDeleteById(id);
    }
}