package com.catalin.tennis.dto.request;

import com.catalin.tennis.model.SetScore;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateScoreDTO {

    @NotNull(message = "Match ID is required")
    private Long matchId;

    @NotNull(message = "List of sets is required")
    private List<SetScore> sets;
}
