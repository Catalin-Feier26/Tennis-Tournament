package com.catalin.tennis.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateMatchDTO {

    @NotNull(message = "Player 1 ID is required")
    private Long player1Id;

    @NotNull(message = "Player 2 ID is required")
    private Long player2Id;

    @NotNull(message = "Referee ID is required")
    private Long refereeId;

    @NotNull(message = "Tournament ID is required")
    private Long tournamentId;

    @NotNull(message = "Start date is required")
    @Future(message = "Match start date must be in the future")
    private LocalDateTime startDate;
}
