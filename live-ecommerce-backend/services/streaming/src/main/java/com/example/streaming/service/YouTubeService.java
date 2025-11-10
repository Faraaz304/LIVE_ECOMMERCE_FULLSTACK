package com.example.streaming.service;

import com.example.streaming.model.StreamRequest;
import com.example.streaming.model.StreamDetailsResponse;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.*;
import com.google.api.client.util.DateTime;
import lombok.extern.slf4j.Slf4j; // Ensure lombok is working for 'log'
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;


@Service
@Slf4j // Ensure lombok is processing this for the 'log' variable
public class YouTubeService {

    private static final String APPLICATION_NAME = "YouTube-E-commerce-Streaming-Service";
    private static final JacksonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final NetHttpTransport HTTP_TRANSPORT = new NetHttpTransport();

    @Value("${youtube.api-key:}")
    private String youtubeApiKey;

    private YouTube getYouTubeService(OAuth2AuthorizedClient authorizedClient) throws IOException {
        String accessToken = authorizedClient.getAccessToken().getTokenValue();
        String refreshToken = authorizedClient.getRefreshToken() != null ? authorizedClient.getRefreshToken().getTokenValue() : null;

        Credential credential = new GoogleCredential.Builder()
                .setTransport(HTTP_TRANSPORT)
                .setJsonFactory(JSON_FACTORY)
                .setClientSecrets(System.getProperty("YOUTUBE_CLIENT_ID"), System.getProperty("YOUTUBE_CLIENT_SECRET"))
                .build()
                .setAccessToken(accessToken)
                .setRefreshToken(refreshToken);

        return new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public StreamDetailsResponse createLiveStream(OAuth2AuthorizedClient authorizedClient, StreamRequest request) throws IOException {
        YouTube youtube = getYouTubeService(authorizedClient);

        // 1. Create a LiveStream (the ingestion point)
        LiveStreamSnippet liveStreamSnippet = new LiveStreamSnippet()
                .setTitle(request.getTitle()) // Lombok getter should now be found
                .setDescription(request.getDescription()); // Lombok getter should now be found

        CdnSettings cdnSettings = new CdnSettings()
                .setFormat("1080p")
                .setIngestionType("rtmp");

        LiveStream liveStream = new LiveStream()
                .setSnippet(liveStreamSnippet)
                .setCdn(cdnSettings)
                .setStatus(new LiveStreamStatus().setStreamStatus("active"));

        LiveStream insertLiveStreamResponse = youtube.liveStreams().insert(Arrays.asList("snippet", "cdn", "status"), liveStream).execute(); // FIXED
        log.info("LiveStream created: {}", insertLiveStreamResponse.getId()); // Lombok 'log' should now be found

        // 2. Create a LiveBroadcast (the event viewers see)
        LiveBroadcastSnippet liveBroadcastSnippet = new LiveBroadcastSnippet()
                .setTitle(request.getTitle()) // Lombok getter should now be found
                .setDescription(request.getDescription()) // Lombok getter should now be found
                .setScheduledStartTime(new DateTime(Instant.now().toEpochMilli()));

        LiveBroadcastStatus liveBroadcastStatus = new LiveBroadcastStatus()
                .setPrivacyStatus(request.getPrivacyStatus())
                .setSelfDeclaredMadeForKids(false);

        LiveBroadcastContentDetails contentDetails = new LiveBroadcastContentDetails()
            .setEnableAutoStart(true)
            .setEnableAutoStop(true);

        LiveBroadcast liveBroadcast = new LiveBroadcast()
                .setSnippet(liveBroadcastSnippet)
                .setStatus(liveBroadcastStatus)
                .setContentDetails(contentDetails);

        LiveBroadcast insertLiveBroadcastResponse = youtube.liveBroadcasts().insert(Arrays.asList("snippet", "status", "contentDetails"), liveBroadcast).execute(); // FIXED
        log.info("LiveBroadcast created: {}", insertLiveBroadcastResponse.getId()); // Lombok 'log' should now be found

        // 3. Bind the LiveStream to the LiveBroadcast
        youtube.liveBroadcasts().bind(insertLiveBroadcastResponse.getId(), Arrays.asList("id", "snippet", "status")).setStreamId(insertLiveStreamResponse.getId()).execute(); // FIXED
        log.info("LiveStream bound to LiveBroadcast."); // Lombok 'log' should now be found

        IngestionInfo ingestionInfo = insertLiveStreamResponse.getCdn().getIngestionInfo();

        return new StreamDetailsResponse( // This constructor should now work if Lombok is active
                insertLiveBroadcastResponse.getId(),
                insertLiveStreamResponse.getId(),
                ingestionInfo.getIngestionAddress(),
                ingestionInfo.getStreamName(),
                "https://www.youtube.com/watch?v=" + insertLiveBroadcastResponse.getId(),
                "Live stream created successfully!",
                true
        );
    }

    public boolean endLiveBroadcast(OAuth2AuthorizedClient authorizedClient, String broadcastId) throws IOException {
        YouTube youtube = getYouTubeService(authorizedClient);

        LiveBroadcast transitionResponse = youtube.liveBroadcasts()
            .transition("complete", broadcastId, Collections.singletonList("status")).execute();

        if ("complete".equals(transitionResponse.getStatus().getLifeCycleStatus())) {
            log.info("LiveBroadcast {} successfully transitioned to COMPLETE.", broadcastId);
            return true;
        } else {
            log.warn("Failed to transition LiveBroadcast {} to COMPLETE. Current status: {}", broadcastId, transitionResponse.getStatus().getLifeCycleStatus());
            return false;
        }
    }

    public Video getVideoDetails(String videoId) throws IOException {
        if (youtubeApiKey == null || youtubeApiKey.isEmpty()) {
            throw new IllegalStateException("YouTube API key not configured. Cannot fetch public video details.");
        }

        YouTube youtube = new YouTube.Builder(HTTP_TRANSPORT, JSON_FACTORY, null)
                .setApplicationName(APPLICATION_NAME)
                .build();

        VideoListResponse videoListResponse = youtube.videos()
                .list(Arrays.asList("snippet", "statistics", "liveStreamingDetails")) // FIXED
                .setId(Collections.singletonList(videoId))
                .setKey(youtubeApiKey)
                .execute();

        if (videoListResponse.getItems().isEmpty()) {
            return null;
        }
        return videoListResponse.getItems().get(0);
    }
}