package com.catalin.tennis.service;

import com.catalin.tennis.dto.request.RegistrationRequestDTO;
import com.catalin.tennis.dto.response.RegistrationResponseDTO;

import java.util.List;

public interface RegistrationService {
    RegistrationResponseDTO registerPlayer(RegistrationRequestDTO dto);
    List<RegistrationResponseDTO> getRegistrationsByPlayer(Long playerId);
    List<RegistrationResponseDTO> getRegistrationsByTournament(Long tournamentId);

}
