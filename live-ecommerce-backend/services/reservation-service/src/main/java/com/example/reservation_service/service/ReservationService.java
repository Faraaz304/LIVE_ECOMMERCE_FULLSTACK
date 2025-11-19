package com.example.reservation_service.service;

import com.example.reservation_service.dto.ReservationRequest;
import com.example.reservation_service.entity.Reservation;

import java.util.List;

public interface ReservationService {
    Reservation createReservation(ReservationRequest request);
    List<Reservation> getAllReservations();
}

