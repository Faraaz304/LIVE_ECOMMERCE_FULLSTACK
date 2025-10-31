package com.livecommerce.stream_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stream_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StreamSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    @Column(name = "host_id", nullable = false)
    private String hostId;

    @Enumerated(EnumType.STRING)
    private StreamStatus status;

    @Column(name = "agora_channel_name")
    private String agoraChannelName;

    @Column(name = "agora_token", length = 1024)
    private String agoraToken;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private int viewCount;
}
