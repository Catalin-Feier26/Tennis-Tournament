package com.catalin.tennis.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RegistrationResponseDTO {
    private String playerName;
    private String tournamentName;
    private LocalDateTime registrationDate;
}
