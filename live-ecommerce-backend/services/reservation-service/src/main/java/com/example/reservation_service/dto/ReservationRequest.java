package com.example.reservation_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequest {

    private String customerName;
    private String customerPhone;
    private String customerEmail;

    private List<String> productIds;

    private String date;
    private String time;
}
