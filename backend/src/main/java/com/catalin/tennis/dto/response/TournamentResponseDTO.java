package com.catalin.tennis.dto.response;

import lombok.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TournamentResponseDTO {
    private Long id; // Unique identifier for React key
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate registrationDeadline;
    private int maxParticipants; // Include if needed for your UI
}
