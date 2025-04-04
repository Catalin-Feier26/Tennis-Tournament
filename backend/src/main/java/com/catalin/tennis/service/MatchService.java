package com.catalin.tennis.service;

import com.catalin.tennis.dto.request.CreateMatchDTO;
import com.catalin.tennis.dto.request.UpdateScoreDTO;
import com.catalin.tennis.dto.response.MatchResponseDTO;

import java.util.List;

public interface MatchService {
    MatchResponseDTO createMatch(CreateMatchDTO dto);
    MatchResponseDTO updateScore(UpdateScoreDTO dto);
    List<MatchResponseDTO> getMatchesByTournament(Long tournamentId);
    List<MatchResponseDTO> getMatchesByReferee(Long refereeId);
    List<MatchResponseDTO> getMatchesByPlayer(Long playerId);
}
