package com.catalin.tennis.dto.response;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class TournamentResponseDTO {
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate registrationDeadline;
}
