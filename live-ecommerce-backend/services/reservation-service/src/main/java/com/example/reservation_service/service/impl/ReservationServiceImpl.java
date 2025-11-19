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
    private final ProductClient productClient;  // 🔥 inject feign client

    @Override
    public Reservation createReservation(ReservationRequest request) {

        // 🔹 Check products before save
        if (request.getProductIds() != null) {

            for (String productIdStr : request.getProductIds()) {
                Long productId = Long.parseLong(productIdStr.trim());

                // 1️⃣ Fetch product from product-service
                ProductDTO product = productClient.getProductById(productId);

                if (product == null) {
                    throw new RuntimeException("Invalid product ID: " + productId);
                }

                // 2️⃣ Check stock
                if (product.getStock() <= 0) {
                    throw new RuntimeException("Product out of stock: " + productId);
                }

                // 3️⃣ Reduce stock in product-service
                productClient.reduceStock(productId, 1);
            }
        }

        // 🔹 Save Reservation
        Reservation r = new Reservation();
        r.setCustomerName(request.getCustomerName());
        r.setCustomerPhone(request.getCustomerPhone());
        r.setCustomerEmail(request.getCustomerEmail());
        r.setProductIds(String.join(",", request.getProductIds()));
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
