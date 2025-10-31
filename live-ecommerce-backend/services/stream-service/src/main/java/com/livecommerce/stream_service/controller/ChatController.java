package com.livecommerce.stream_service.controller;

import com.livecommerce.stream_service.dto.ChatMessageDTO;
import com.livecommerce.stream_service.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/streams/{streamId}/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * Send (persist) a chat message for a stream.
     */
    @PostMapping
    public ResponseEntity<ChatMessageDTO> sendMessage(
            @PathVariable("streamId") Long streamId,
            @Valid @RequestBody ChatMessageDTO messageDTO
    ) {
        // ensure DTO has streamId set (or set here)
        messageDTO.setStreamId(streamId);
        ChatMessageDTO saved = chatService.sendMessage(messageDTO);
        return ResponseEntity.status(201).body(saved);
    }

    /**
     * Get chat messages for a stream
     */
    @GetMapping
    public ResponseEntity<List<ChatMessageDTO>> getMessages(@PathVariable("streamId") Long streamId) {
        List<ChatMessageDTO> messages = chatService.getMessagesByStream(streamId);
        return ResponseEntity.ok(messages);
    }
}
