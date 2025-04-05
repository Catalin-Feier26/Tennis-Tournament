package com.catalin.tennis.controller;

import com.catalin.tennis.dto.request.RegistrationRequestDTO;
import com.catalin.tennis.dto.response.RegistrationResponseDTO;
import com.catalin.tennis.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {
    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService){
        this.registrationService=registrationService;
    }

    @PostMapping
    public ResponseEntity<RegistrationResponseDTO> registerPLayer(@Valid @RequestBody RegistrationRequestDTO dto){
        RegistrationResponseDTO response =registrationService.registerPlayer(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
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
}
