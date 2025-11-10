package com.example.streaming.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StreamRequest {
    private String title;
    private String description;
    private String privacyStatus; // e.g., "public", "unlisted", "private"
    // Add more fields if needed for product association, etc.
}