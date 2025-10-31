package com.livecommerce.stream_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AgoraConfig {

    @Value("${agora.app-id}")
    private String appId;

    @Value("${agora.app-certificate}")
    private String appCertificate;

    @Value("${agora.token-expiry-seconds:3600}")
    private int tokenExpiry;

    public String getAppId() {
        return appId;
    }

    public String getAppCertificate() {
        return appCertificate;
    }

    public int getTokenExpiry() {
        return tokenExpiry;
    }
}
