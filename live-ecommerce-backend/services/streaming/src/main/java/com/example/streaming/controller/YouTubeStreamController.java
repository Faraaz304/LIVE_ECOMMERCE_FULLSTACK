package com.example.streaming.controller;

import com.example.streaming.model.StreamRequest;
import com.example.streaming.model.StreamDetailsResponse;
import com.example.streaming.service.YouTubeService;
import com.google.api.services.youtube.model.Video;
import lombok.extern.slf4j.Slf4j; // Ensure lombok is working for 'log'
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/youtube")
@Slf4j // Ensure lombok is processing this for the 'log' variable
public class YouTubeStreamController {

    private final YouTubeService youtubeService;

    public YouTubeStreamController(YouTubeService youtubeService) {
        this.youtubeService = youtubeService;
    }

    @GetMapping("/auth-status")
    public ResponseEntity<Map<String, Object>> getAuthStatus(@AuthenticationPrincipal OAuth2User oauth2User) {
        Map<String, Object> response = new HashMap<>();
        if (oauth2User != null) {
            response.put("authenticated", true);
            response.put("userName", oauth2User.getAttribute("name"));
            response.put("email", oauth2User.getAttribute("email"));
        } else {
            response.put("authenticated", false);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/stream/create")
    public ResponseEntity<?> createStream(
            @RegisteredOAuth2AuthorizedClient("google") OAuth2AuthorizedClient authorizedClient,
            @RequestBody StreamRequest streamRequest) {

        if (authorizedClient == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "User not authenticated. Please perform OAuth2 login first."));
        }

        try {
            StreamDetailsResponse response = youtubeService.createLiveStream(authorizedClient, streamRequest);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Error creating YouTube stream: {}", e.getMessage(), e); // 'log' should now be found
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Collections.singletonMap("message", "Failed to create stream: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error creating YouTube stream: {}", e.getMessage(), e); // 'log' should now be found
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Collections.singletonMap("message", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/stream/end")
    public ResponseEntity<?> endStream(
            @RegisteredOAuth2AuthorizedClient("google") OAuth2AuthorizedClient authorizedClient,
            @RequestParam("broadcastId") String broadcastId) {

        if (authorizedClient == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "User not authenticated."));
        }

        try {
            boolean success = youtubeService.endLiveBroadcast(authorizedClient, broadcastId);
            if (success) {
                return ResponseEntity.ok(Collections.singletonMap("message", "Live broadcast successfully ended."));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                     .body(Collections.singletonMap("message", "Failed to end live broadcast."));
            }
        } catch (IOException e) {
            log.error("Error ending YouTube stream {}: {}", broadcastId, e.getMessage(), e); // 'log' should now be found
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Collections.singletonMap("message", "Error ending stream: " + e.getMessage()));
        }
    }

    @GetMapping("/video-details")
    public ResponseEntity<?> getVideoDetails(@RequestParam("videoId") String videoId) {
        try {
            Video video = youtubeService.getVideoDetails(videoId);
            if (video != null) {
                return ResponseEntity.ok(video);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body(Collections.singletonMap("message", "Video not found or inaccessible."));
            }
        } catch (IOException e) {
            log.error("Error fetching video details for {}: {}", videoId, e.getMessage(), e); // 'log' should now be found
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Collections.singletonMap("message", "Error fetching video details: " + e.getMessage()));
        } catch (IllegalStateException e) {
             log.error("Configuration error: {}", e.getMessage(), e); // 'log' should now be found
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                  .body(Collections.singletonMap("message", "Configuration error: " + e.getMessage()));
        }
    }
}