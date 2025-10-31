package com.livecommerce.stream_service.repository;

import com.livecommerce.stream_service.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByStreamSessionId(Long streamId);
}
