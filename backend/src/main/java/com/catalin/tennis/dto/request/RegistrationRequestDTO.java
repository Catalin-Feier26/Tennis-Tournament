package com.catalin.tennis.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequestDTO {

    @NotNull(message = "Player ID is required")
    private Long playerId;

    @NotNull(message = "Tournament ID is required")
    private Long tournamentId;
}
