package com.livecommerce.compliance_service.service;

import com.livecommerce.compliance_service.dto.KycRequest;
import com.livecommerce.compliance_service.dto.KycResponse;
import com.livecommerce.compliance_service.dto.KycVerifyRequest;

public interface KycService {

    KycResponse submitKyc(KycRequest request);

    KycResponse getKycStatus(Long userId);

    KycResponse verifyKyc(Long userId, KycVerifyRequest request);
}

