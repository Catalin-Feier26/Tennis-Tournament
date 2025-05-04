package com.catalin.tennis.dto.response;

import com.catalin.tennis.model.enums.RegistrationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RegistrationResponseDTO {
    private Long id;
    private String playerName;
    private String tournamentName;
    private LocalDateTime registrationDate;
    private RegistrationStatus status;

}
