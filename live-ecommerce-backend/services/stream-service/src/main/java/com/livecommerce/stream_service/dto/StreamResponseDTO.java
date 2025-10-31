package com.livecommerce.stream_service.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StreamResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String hostId;
    private String status;
    private String agoraChannelName;
    private String agoraToken;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int viewCount;
}
