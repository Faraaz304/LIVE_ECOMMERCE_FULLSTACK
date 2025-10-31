package com.livecommerce.stream_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgoraTokenResponseDTO {
    private String channelName;
    private String token;
    private String uid;
    private Long expireTimestamp;
}
