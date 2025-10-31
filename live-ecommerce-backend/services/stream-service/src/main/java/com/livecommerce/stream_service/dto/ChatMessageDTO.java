package com.livecommerce.stream_service.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDTO {
    private Long id;
    private Long streamId;
    private String sender;
    private String message;
    private LocalDateTime timestamp;
}
