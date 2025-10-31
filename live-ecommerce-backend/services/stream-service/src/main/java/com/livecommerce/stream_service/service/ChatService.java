package com.livecommerce.stream_service.service;

import com.livecommerce.stream_service.dto.ChatMessageDTO;
import java.util.List;

public interface ChatService {
    ChatMessageDTO sendMessage(ChatMessageDTO messageDTO);
    List<ChatMessageDTO> getMessagesByStream(Long streamId);
}
