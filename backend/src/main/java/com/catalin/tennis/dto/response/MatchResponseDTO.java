package com.catalin.tennis.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MatchResponseDTO {
    private String player1Name;
    private String player2Name;
    private String refereeName;
    private String tournamentName;
    private int scorePlayer1;
    private int scorePlayer2;
    private LocalDateTime startDate;
}
