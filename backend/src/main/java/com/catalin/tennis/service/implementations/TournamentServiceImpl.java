package com.catalin.tennis.service.implementations;

import com.catalin.tennis.dto.request.CreateTournamentDTO;
import com.catalin.tennis.dto.response.TournamentResponseDTO;
import com.catalin.tennis.exception.TournamentNameTakenException;
import com.catalin.tennis.exception.TournamentNotFoundException;
import com.catalin.tennis.factory.TournamentFactory;
import com.catalin.tennis.model.Tournament;
import com.catalin.tennis.repository.TournamentRepository;
import com.catalin.tennis.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TournamentServiceImpl implements TournamentService {
    private final TournamentRepository tournamentRepository;

    @Autowired
    public TournamentServiceImpl(TournamentRepository tournamentRepository){
        this.tournamentRepository=tournamentRepository;
    }

    @Override
    public TournamentResponseDTO createTournament(CreateTournamentDTO dto) {
        if(tournamentRepository.existsByName(dto.getName())){
            throw new TournamentNameTakenException("A tournament with the name: " + dto.getName() + " already exists.");
        }
        Tournament tournament = TournamentFactory.createTournament(
                dto.getName(),
                dto.getStartDate(),
                dto.getEndDate(),
                dto.getRegistrationDeadline(),
                dto.getMaxParticipants()
        );
        tournamentRepository.save(tournament);
        return new TournamentResponseDTO(tournament.getId(), tournament.getName(),tournament.getStartDate(),tournament.getEndDate(), tournament.getRegistrationDeadline(), tournament.getMaxParticipants());

    }

    @Override
    public void deleteTournament(Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId).orElseThrow(
                ()-> new TournamentNotFoundException("Tournament not found")
        );
        tournamentRepository.delete(tournament);
    }

    @Override
    public List<TournamentResponseDTO> getAllTournaments() {
        List<Tournament> tournamentList = tournamentRepository.findAll();
        if(tournamentList.isEmpty()){
            throw new TournamentNotFoundException("No tournaments");
        }
        List<TournamentResponseDTO> dtos = new ArrayList<>();
        for(Tournament t: tournamentList){
            dtos.add(
                    new TournamentResponseDTO(t.getId(),t.getName(),t.getStartDate(),t.getEndDate(),t.getRegistrationDeadline(), t.getMaxParticipants())
            );
        }
        return dtos;
    }

    @Override
    public TournamentResponseDTO getTournamentByName(String name) {
        if(!tournamentRepository.existsByName(name)){
            throw new TournamentNotFoundException("No such tournament exists");
        }
        Tournament tournament=tournamentRepository.findByName(name).orElseThrow(
                () -> new TournamentNotFoundException("No such tournament exists")
        );
        return new TournamentResponseDTO(tournament.getId(), tournament.getName(),tournament.getStartDate(),tournament.getEndDate(), tournament.getRegistrationDeadline(), tournament.getMaxParticipants());
    }

    @Override
    public List<TournamentResponseDTO> getTournamentsStartingAfter(String date) {
        LocalDate parsedDate = LocalDate.parse(date);
        List<Tournament> tournamentList = tournamentRepository.findAll()
                .stream()
                .filter(t -> t.getStartDate().isAfter(parsedDate))
                .toList();

        if (tournamentList.isEmpty()) {
            throw new TournamentNotFoundException("No tournaments starting after " + date);
        }

        List<TournamentResponseDTO> dtos = new ArrayList<>();
        for (Tournament t : tournamentList) {
            dtos.add(new TournamentResponseDTO(t.getId(),t.getName(), t.getStartDate(), t.getEndDate(), t.getRegistrationDeadline(),t.getMaxParticipants()));
        }
        return dtos;
    }

}
