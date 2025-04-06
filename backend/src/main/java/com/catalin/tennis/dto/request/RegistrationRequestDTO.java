package com.catalin.tennis.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequestDTO {
    @NotBlank(message = "Player username is required")
    private String playerUsername;

    @NotNull(message = "Tournament ID is required")
    private Long tournamentId;
}
