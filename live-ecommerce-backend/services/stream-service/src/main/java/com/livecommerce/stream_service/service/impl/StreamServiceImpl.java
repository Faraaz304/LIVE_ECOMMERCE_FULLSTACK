package com.livecommerce.stream_service.service.impl;

import com.livecommerce.stream_service.dto.StreamRequestDTO;
import com.livecommerce.stream_service.dto.StreamResponseDTO;
import com.livecommerce.stream_service.entity.StreamSession;
import com.livecommerce.stream_service.exception.StreamNotFoundException;
import com.livecommerce.stream_service.repository.StreamSessionRepository;
import com.livecommerce.stream_service.service.StreamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StreamServiceImpl implements StreamService {

    @Autowired
    private StreamSessionRepository streamSessionRepository;

    @Override
    public StreamResponseDTO createStream(StreamRequestDTO requestDTO) {
        StreamSession stream = new StreamSession();
        stream.setTitle(requestDTO.getTitle());
        stream.setHostId(requestDTO.getHostId());
        stream.setDescription(requestDTO.getDescription());
        stream.setCategory(requestDTO.getCategory());
        stream.setIsActive(true);
        stream.setStartTime(LocalDateTime.now());

        StreamSession savedStream = streamSessionRepository.save(stream);

        return new StreamResponseDTO(
                savedStream.getId(),
                savedStream.getTitle(),
                savedStream.getHostId(),
                savedStream.getDescription(),
                savedStream.getCategory(),
                savedStream.getIsActive(),
                savedStream.getStartTime(),
                savedStream.getEndTime()
        );
    }

    @Override
    public StreamResponseDTO endStream(Long streamId) {
        StreamSession stream = streamSessionRepository.findById(streamId)
                .orElseThrow(() -> new StreamNotFoundException("Stream not found with id: " + streamId));

        stream.setIsActive(false);
        stream.setEndTime(LocalDateTime.now());
        streamSessionRepository.save(stream);

        return new StreamResponseDTO(
                stream.getId(),
                stream.getTitle(),
                stream.getHostId(),
                stream.getDescription(),
                stream.getCategory(),
                stream.getIsActive(),
                stream.getStartTime(),
                stream.getEndTime()
        );
    }

    @Override
    public StreamResponseDTO getStreamById(Long streamId) {
        StreamSession stream = streamSessionRepository.findById(streamId)
                .orElseThrow(() -> new StreamNotFoundException("Stream not found with id: " + streamId));

        return new StreamResponseDTO(
                stream.getId(),
                stream.getTitle(),
                stream.getHostId(),
                stream.getDescription(),
                stream.getCategory(),
                stream.getIsActive(),
                stream.getStartTime(),
                stream.getEndTime()
        );
    }

    @Override
    public List<StreamResponseDTO> getAllActiveStreams() {
        return streamSessionRepository.findByIsActiveTrue()
                .stream()
                .map(s -> new StreamResponseDTO(
                        s.getId(),
                        s.getTitle(),
                        s.getHostId(),
                        s.getDescription(),
                        s.getCategory(),
                        s.getIsActive(),
                        s.getStartTime(),
                        s.getEndTime()))
                .collect(Collectors.toList());
    }
}
