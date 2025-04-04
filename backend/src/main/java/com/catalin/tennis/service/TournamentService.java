package com.catalin.tennis.service;

import com.catalin.tennis.dto.request.CreateTournamentDTO;
import com.catalin.tennis.dto.response.TournamentResponseDTO;

import java.util.List;

public interface TournamentService {
    TournamentResponseDTO createTournament(CreateTournamentDTO dto);
    List<TournamentResponseDTO> getAllTournaments();
    TournamentResponseDTO getTournamentByName(String name);
    List<TournamentResponseDTO> getTournamentsStartingAfter(String date);
    void deleteTournament(Long tournamentId);

}
