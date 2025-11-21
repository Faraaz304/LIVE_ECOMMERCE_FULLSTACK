package com.example.reservation_service.service.impl;

import com.example.reservation_service.client.ProductClient;
import com.example.reservation_service.dto.ProductDTO;
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
    private final ProductClient productClient;

    @Override
    public Reservation createReservation(ReservationRequest request) {

        // 🔹 Save Reservation - productIds is optional
        Reservation r = new Reservation();
        r.setCustomerName(request.getCustomerName());
        r.setCustomerPhone(request.getCustomerPhone());
        r.setCustomerEmail(request.getCustomerEmail());
        
        // Handle null/empty productIds
        if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
            r.setProductIds(String.join(",", request.getProductIds()));
        }
        
        r.setDate(request.getDate());
        r.setTime(request.getTime());
        r.setCreatedAt(LocalDateTime.now());

        return repo.save(r);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return repo.findAll();
    }
}