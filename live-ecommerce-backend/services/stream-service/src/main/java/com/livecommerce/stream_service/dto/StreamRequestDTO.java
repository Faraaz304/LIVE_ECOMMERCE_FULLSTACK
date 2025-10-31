package com.livecommerce.stream_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StreamRequestDTO {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String hostId;
}
