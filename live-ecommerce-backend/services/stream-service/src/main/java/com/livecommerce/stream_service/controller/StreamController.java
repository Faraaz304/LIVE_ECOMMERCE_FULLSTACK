package com.livecommerce.stream_service.controller;

import com.livecommerce.stream_service.dto.AgoraTokenResponseDTO;
import com.livecommerce.stream_service.dto.StreamRequestDTO;
import com.livecommerce.stream_service.dto.StreamResponseDTO;
import com.livecommerce.stream_service.service.AgoraIntegrationService;
import com.livecommerce.stream_service.service.StreamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/streams")
@RequiredArgsConstructor
public class StreamController {

    private final StreamService streamService;
    private final AgoraIntegrationService agoraIntegrationService;

    /**
     * Create a new stream (scheduled/created).
     */
    @PostMapping
    public ResponseEntity<StreamResponseDTO> createStream(@Valid @RequestBody StreamRequestDTO request) {
        StreamResponseDTO response = streamService.createStream(request);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * Start stream: generate Agora token for a channel and return token details.
     *
     * NOTE: persisting channelName / token into the StreamSession should be handled
     * inside StreamServiceImpl (or add streamService.startStream to encapsulate both actions).
     */
    @PostMapping("/{id}/start")
    public ResponseEntity<AgoraTokenResponseDTO> startStream(
            @PathVariable("id") Long streamId,
            @RequestParam(value = "uid", required = false) Long uid // optional numeric user id
    ) {
        // Choose channelName (could be "stream-{id}" or from StreamSession). Here we use stream id-derived name:
        String channelName = "stream-" + streamId;
        Long userId = uid == null ? 0L : uid;
        AgoraTokenResponseDTO token = agoraIntegrationService.generateToken(channelName, userId);

        // OPTIONAL: call streamService to update streamSession with channel & token.
        // e.g. streamService.attachAgoraInfo(streamId, token)  <-- implement if desired.

        return ResponseEntity.ok(token);
    }

    /**
     * End stream (set status to ENDED and return latest details)
     */
    @PostMapping("/{id}/end")
    public ResponseEntity<StreamResponseDTO> endStream(@PathVariable("id") Long streamId) {
        StreamResponseDTO response = streamService.endStream(streamId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get details of a stream
     */
    @GetMapping("/{id}")
    public ResponseEntity<StreamResponseDTO> getStream(@PathVariable("id") Long streamId) {
        StreamResponseDTO response = streamService.getStreamById(streamId);
        return ResponseEntity.ok(response);
    }

    /**
     * List currently active/live streams
     */
    @GetMapping("/live")
    public ResponseEntity<List<StreamResponseDTO>> listLiveStreams() {
        List<StreamResponseDTO> list = streamService.getAllActiveStreams();
        return ResponseEntity.ok(list);
    }
}
