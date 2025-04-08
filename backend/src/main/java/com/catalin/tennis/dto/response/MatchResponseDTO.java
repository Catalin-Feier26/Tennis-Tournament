package com.catalin.tennis.dto.response;

import com.catalin.tennis.model.SetScore;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class MatchResponseDTO {
    private Long matchId;
    private String player1Name;
    private String player2Name;
    private String refereeName;
    private String tournamentName;
    private Integer courtNumber;
    private LocalDateTime startDate;
    private List<SetScore> sets;
}
