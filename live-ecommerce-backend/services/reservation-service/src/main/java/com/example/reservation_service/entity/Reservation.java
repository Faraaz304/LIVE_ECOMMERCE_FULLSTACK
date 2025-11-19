package com.example.reservation_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String customerPhone;
    private String customerEmail;

    private String productIds; // "101,102" stored as string

    private String date;
    private String time;

    private LocalDateTime createdAt = LocalDateTime.now();
}

