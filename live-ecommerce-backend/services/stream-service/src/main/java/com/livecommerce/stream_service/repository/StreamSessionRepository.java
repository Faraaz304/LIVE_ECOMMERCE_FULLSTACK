package com.livecommerce.stream_service.repository;

import com.livecommerce.stream_service.entity.StreamSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StreamSessionRepository extends JpaRepository<StreamSession, Long> {
    List<StreamSession> findByHostId(Long hostId);
    List<StreamSession> findByIsActiveTrue();
}
