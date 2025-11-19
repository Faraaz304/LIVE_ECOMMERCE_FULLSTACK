package com.example.reservation_service.controller;

import com.example.reservation_service.dto.ReservationRequest;
import com.example.reservation_service.entity.Reservation;
import com.example.reservation_service.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {

    private final ReservationService service;

    @PostMapping
    public ResponseEntity<Reservation> create(@RequestBody ReservationRequest request) {
        return ResponseEntity.ok(service.createReservation(request));
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAll() {
        return ResponseEntity.ok(service.getAllReservations());
    }
}


