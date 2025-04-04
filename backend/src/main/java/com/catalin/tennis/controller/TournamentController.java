package com.catalin.tennis.controller;

import com.catalin.tennis.dto.request.CreateTournamentDTO;
import com.catalin.tennis.dto.response.TournamentResponseDTO;
import com.catalin.tennis.service.TournamentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {
    private final TournamentService tournamentService;

    public TournamentController(TournamentService tournamentService){
        this.tournamentService=tournamentService;
    }
    @PostMapping
    public ResponseEntity<TournamentResponseDTO> createTournament(@Valid @RequestBody CreateTournamentDTO dto){
        TournamentResponseDTO responseDTO = tournamentService.createTournament(dto);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TournamentResponseDTO>> getAllTournamnets(){
        List<TournamentResponseDTO> tournaments = tournamentService.getAllTournaments();
        return ResponseEntity.ok(tournaments);
    }

    @GetMapping("/starting-after/{date}")
    public ResponseEntity<List<TournamentResponseDTO>> getTournamentsStartingAfter(@PathVariable String date) {
        List<TournamentResponseDTO> tournaments = tournamentService.getTournamentsStartingAfter(date);
        return ResponseEntity.ok(tournaments);
    }

    @DeleteMapping("{/id}")
    public ResponseEntity<String> deleteTournament(@PathVariable Long id){
        tournamentService.deleteTournament(id);
        return ResponseEntity.ok("Tournament deleted successfully");
    }
}
