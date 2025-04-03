package com.catalin.tennis.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateScoreDTO {

    @NotNull(message = "Match ID is required")
    private Long matchId;

    @Min(value = 0, message = "Score must be zero or positive")
    private int scorePlayer1;

    @Min(value = 0, message = "Score must be zero or positive")
    private int scorePlayer2;
}
