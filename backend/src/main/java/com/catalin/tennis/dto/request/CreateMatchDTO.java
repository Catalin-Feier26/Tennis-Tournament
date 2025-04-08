package com.catalin.tennis.dto.request;

import com.catalin.tennis.model.SetScore;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateMatchDTO {

    @NotNull(message = "Player 1 username is required")
    private String player1Username;

    @NotNull(message = "Player 2 username is required")
    private String player2Username;

    @NotNull(message = "Referee username is required")
    private String refereeUsername;

    @NotNull(message = "Tournament ID is required")
    private Long tournamentId;

    @NotNull(message = "Court number is required")
    private Integer courtNumber;

    @NotNull(message = "Start date is required")
    @Future(message = "Match start date must be in the future")
    private LocalDateTime startDate;

    private List<SetScore> sets;

    private transient Long player1Id;
    private transient Long player2Id;
    private transient Long refereeId;
}
