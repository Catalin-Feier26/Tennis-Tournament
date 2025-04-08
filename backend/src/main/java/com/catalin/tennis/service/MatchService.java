package com.catalin.tennis.service;

import com.catalin.tennis.dto.request.CreateMatchDTO;
import com.catalin.tennis.dto.request.UpdateScoreDTO;
import com.catalin.tennis.dto.response.MatchResponseDTO;

import java.util.List;

public interface MatchService {
    MatchResponseDTO createMatch(CreateMatchDTO dto);
    MatchResponseDTO updateScore(UpdateScoreDTO dto);
    List<MatchResponseDTO> getMatchesByTournament(Long tournamentId);
    List<MatchResponseDTO> getMatchesByPlayer(String username);
    void deleteMatchById(Long id);
    List<MatchResponseDTO> getMatchesByRefereeUsername(String username);
    byte[] exportMatchesToCsvByTournament(Long tournamentId);

}
