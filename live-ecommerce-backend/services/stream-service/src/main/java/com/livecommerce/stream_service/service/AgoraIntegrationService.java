package com.livecommerce.stream_service.service;

import com.livecommerce.stream_service.dto.AgoraTokenResponseDTO;

public interface AgoraIntegrationService {
    AgoraTokenResponseDTO generateToken(String channelName, Long userId);
}
