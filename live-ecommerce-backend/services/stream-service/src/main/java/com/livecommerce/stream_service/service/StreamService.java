package com.livecommerce.stream_service.service;

import com.livecommerce.stream_service.dto.StreamRequestDTO;
import com.livecommerce.stream_service.dto.StreamResponseDTO;
import java.util.List;

public interface StreamService {
    StreamResponseDTO createStream(StreamRequestDTO requestDTO);
    StreamResponseDTO endStream(Long streamId);
    StreamResponseDTO getStreamById(Long streamId);
    List<StreamResponseDTO> getAllActiveStreams();
}
