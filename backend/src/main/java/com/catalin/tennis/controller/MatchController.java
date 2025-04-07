package com.catalin.tennis.controller;

import com.catalin.tennis.dto.request.CreateMatchDTO;
import com.catalin.tennis.dto.request.UpdateScoreDTO;
import com.catalin.tennis.dto.response.MatchResponseDTO;
import com.catalin.tennis.service.MatchService;
import com.catalin.tennis.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {
    private final MatchService matchService;
    private final UserService userService;

    public MatchController(MatchService matchService, UserService userService){
        this.matchService = matchService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<MatchResponseDTO> createMatch(@Valid @RequestBody CreateMatchDTO dto){
        // Convert usernames to IDs
        Long player1Id = userService.getUserIdByUsername(dto.getPlayer1Username());
        Long player2Id = userService.getUserIdByUsername(dto.getPlayer2Username());
        Long refereeId = userService.getUserIdByUsername(dto.getRefereeUsername());

        // Update DTO with IDs
        dto.setPlayer1Id(player1Id);
        dto.setPlayer2Id(player2Id);
        dto.setRefereeId(refereeId);

        MatchResponseDTO response = matchService.createMatch(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/score")
    public ResponseEntity<MatchResponseDTO> updateScore(@Valid @RequestBody UpdateScoreDTO dto){
        MatchResponseDTO response = matchService.updateScore(dto);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMatch(@PathVariable Long id) {
        try {
            matchService.deleteMatchById(id);
            return ResponseEntity.ok("Match deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete match: " + e.getMessage());
        }
    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<List<MatchResponseDTO>> getMatchesByTournament(@PathVariable Long tournamentId) {
        List<MatchResponseDTO> matches = matchService.getMatchesByTournament(tournamentId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/referee/username/{refereeUsername}")
    public ResponseEntity<List<MatchResponseDTO>> getMatchesByRefereeUsername(@PathVariable String refereeUsername) {
        List<MatchResponseDTO> matches = matchService.getMatchesByRefereeUsername(refereeUsername);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/player/{username}")
    public ResponseEntity<List<MatchResponseDTO>> getMatchesByPlayer(@PathVariable String username) {
        List<MatchResponseDTO> matches = matchService.getMatchesByPlayer(username);
        return ResponseEntity.ok(matches);
    }
}
