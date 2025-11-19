package com.example.reservation_service.service.impl;

import com.example.reservation_service.dto.ReservationRequest;
import com.example.reservation_service.entity.Reservation;
import com.example.reservation_service.repository.ReservationRepository;
import com.example.reservation_service.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;  
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository repo;

    @Override
    public Reservation createReservation(ReservationRequest request) {
        Reservation r = new Reservation();
        r.setCustomerName(request.getCustomerName());
        r.setCustomerPhone(request.getCustomerPhone());
        r.setCustomerEmail(request.getCustomerEmail());

        if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
            r.setProductIds(String.join(",", request.getProductIds()));
        } else {
            r.setProductIds(null);
        }

        r.setDate(request.getDate());
        r.setTime(request.getTime());

        // 🔥 FIX: set createdAt
        r.setCreatedAt(LocalDateTime.now());

        return repo.save(r);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return repo.findAll();
    }
}
