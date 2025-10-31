package com.livecommerce.stream_service.service.impl;

import com.livecommerce.stream_service.config.AgoraConfig;
import com.livecommerce.stream_service.dto.AgoraTokenResponseDTO;
import com.livecommerce.stream_service.service.AgoraIntegrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.agora.media.RtcTokenBuilder2;

@Service
public class AgoraIntegrationServiceImpl implements AgoraIntegrationService {

    @Autowired
    private AgoraConfig agoraConfig;

    @Override
    public AgoraTokenResponseDTO generateToken(String channelName, Long userId) {
        RtcTokenBuilder2 tokenBuilder = new RtcTokenBuilder2();
        int expirationTimeInSeconds = 3600; // 1 hour validity
        int privilegeExpiredTs = (int) (System.currentTimeMillis() / 1000 + expirationTimeInSeconds);

        String token = tokenBuilder.buildTokenWithUid(
                agoraConfig.getAppId(),
                agoraConfig.getAppCertificate(),
                channelName,
                userId.intValue(),
                RtcTokenBuilder2.Role.ROLE_PUBLISHER,
                privilegeExpiredTs
        );

        return new AgoraTokenResponseDTO(channelName, token, expirationTimeInSeconds);
    }
}
