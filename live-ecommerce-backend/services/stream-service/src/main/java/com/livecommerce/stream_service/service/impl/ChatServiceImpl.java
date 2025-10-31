package com.livecommerce.stream_service.service.impl;

import com.livecommerce.stream_service.dto.ChatMessageDTO;
import com.livecommerce.stream_service.entity.ChatMessage;
import com.livecommerce.stream_service.exception.ChatNotFoundException;
import com.livecommerce.stream_service.repository.ChatMessageRepository;
import com.livecommerce.stream_service.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Override
    public ChatMessageDTO sendMessage(ChatMessageDTO messageDTO) {
        ChatMessage message = new ChatMessage();
        message.setSenderId(messageDTO.getSenderId());
        message.setStreamSessionId(messageDTO.getStreamSessionId());
        message.setMessage(messageDTO.getMessage());
        message.setTimestamp(LocalDateTime.now());

        ChatMessage saved = chatMessageRepository.save(message);

        return new ChatMessageDTO(
                saved.getId(),
                saved.getSenderId(),
                saved.getStreamSessionId(),
                saved.getMessage(),
                saved.getTimestamp()
        );
    }

    @Override
    public List<ChatMessageDTO> getMessagesByStream(Long streamId) {
        List<ChatMessage> messages = chatMessageRepository.findByStreamSessionId(streamId);
        if (messages.isEmpty()) {
            throw new ChatNotFoundException("No chat messages found for stream id: " + streamId);
        }

        return messages.stream()
                .map(m -> new ChatMessageDTO(
                        m.getId(),
                        m.getSenderId(),
                        m.getStreamSessionId(),
                        m.getMessage(),
                        m.getTimestamp()))
                .collect(Collectors.toList());
    }
}
