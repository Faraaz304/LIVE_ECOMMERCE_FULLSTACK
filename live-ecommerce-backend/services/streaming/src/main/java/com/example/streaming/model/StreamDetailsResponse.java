package com.example.streaming.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StreamDetailsResponse {
    private String broadcastId;
    private String streamId;
    private String ingestionAddress;
    private String streamName; // This is the stream key
    private String youtubeViewerUrl;
    private String message;
    private boolean success;
}