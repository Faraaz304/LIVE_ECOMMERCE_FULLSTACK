package com.example.reservation_service.client;

import com.example.reservation_service.dto.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "product-service",
        url = "http://localhost:8082/api/products"
)
public interface ProductClient {

    @GetMapping("/{id}")
    ProductDTO getProductById(@PathVariable("id") Long id);

    @PutMapping("/{id}/reduce-stock")
    void reduceStock(
            @PathVariable("id") Long id,
            @RequestParam("quantity") Integer quantity
    );
}
