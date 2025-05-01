package com.catalin.tennis.controller;

import com.catalin.tennis.dto.request.RegistrationRequestDTO;
import com.catalin.tennis.dto.response.RegistrationResponseDTO;
import com.catalin.tennis.dto.response.RegistrationStatusDTO;
import com.catalin.tennis.exception.RegistrationAlreadyExistsException;
import com.catalin.tennis.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {
    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService){
        this.registrationService=registrationService;
    }

    @PostMapping
    public ResponseEntity<?> registerPlayer(@Valid @RequestBody RegistrationRequestDTO dto){
        try {
            RegistrationResponseDTO response = registrationService.registerPlayer(dto);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RegistrationAlreadyExistsException ex) {
            RegistrationStatusDTO status = new RegistrationStatusDTO("You are already registered for this tournament");
            return new ResponseEntity<>(status, HttpStatus.OK);
        }
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<RegistrationResponseDTO>> getRegistrationsByPlayer(@PathVariable Long playerId){
        List<RegistrationResponseDTO> registrations=registrationService.getRegistrationsByPlayer(playerId);
        return ResponseEntity.ok(registrations);
    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<List<RegistrationResponseDTO>> getRegistrationsByTournament(@PathVariable Long tournamentId){
        List<RegistrationResponseDTO> regs = registrationService.getRegistrationsByTournament(tournamentId);
        return ResponseEntity.ok(regs);
    }
    @GetMapping("/tournament/{tournamentId}/players")
    public ResponseEntity<List<String>> getRegisteredPlayers(@PathVariable Long tournamentId) {
        List<RegistrationResponseDTO> regs = registrationService.getRegistrationsByTournament(tournamentId);
        List<String> usernames = regs.stream()
                .map(RegistrationResponseDTO::getPlayerName)
                .collect(Collectors.toList());
        return ResponseEntity.ok(usernames);
    }
    @PostMapping("/{id}/approve")
    public ResponseEntity<String> approveRegistration(@PathVariable Long id) {
        registrationService.approveRegistration(id);
        return ResponseEntity.ok("Registration approved");
    }

    @PostMapping("/{id}/deny")
    public ResponseEntity<String> denyRegistration(@PathVariable Long id) {
        registrationService.denyRegistration(id);
        return ResponseEntity.ok("Registration denied");
    }
    @GetMapping("/tournament/{tournamentId}/pending")
    public ResponseEntity<List<RegistrationResponseDTO>> getPendingRegistrations(@PathVariable Long tournamentId) {
        List<RegistrationResponseDTO> regs = registrationService.getPendingRegistrationsByTournament(tournamentId);
        return ResponseEntity.ok(regs);
    }

}
