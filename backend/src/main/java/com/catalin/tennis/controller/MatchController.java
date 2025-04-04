package com.catalin.tennis.controller;

import com.catalin.tennis.dto.request.CreateMatchDTO;
import com.catalin.tennis.dto.request.UpdateScoreDTO;
import com.catalin.tennis.dto.response.MatchResponseDTO;
import com.catalin.tennis.service.MatchService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {
    private final MatchService matchService;

    public MatchController(MatchService matchService){
        this.matchService=matchService;
    }

    @PostMapping
    public ResponseEntity<MatchResponseDTO> createMatch(@Valid @RequestBody CreateMatchDTO dto){
        MatchResponseDTO response = matchService.createMatch(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/score")
    public ResponseEntity<MatchResponseDTO> updateScore(@Valid @RequestBody UpdateScoreDTO dto){
        MatchResponseDTO response = matchService.updateScore(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<List<MatchResponseDTO>> getMatchesByTournament(@PathVariable Long tournamentId) {
        List<MatchResponseDTO> matches = matchService.getMatchesByTournament(tournamentId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/referee/{refereeId}")
    public ResponseEntity<List<MatchResponseDTO>> getMatchesByReferee(@PathVariable Long refereeId) {
        List<MatchResponseDTO> matches = matchService.getMatchesByReferee(refereeId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<MatchResponseDTO>> getMatchesByPlayer(@PathVariable Long playerId) {
        List<MatchResponseDTO> matches = matchService.getMatchesByPlayer(playerId);
        return ResponseEntity.ok(matches);
    }
}
