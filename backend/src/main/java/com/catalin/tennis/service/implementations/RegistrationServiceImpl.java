package com.catalin.tennis.service.implementations;

import com.catalin.tennis.dto.request.RegistrationRequestDTO;
import com.catalin.tennis.dto.response.RegistrationResponseDTO;
import com.catalin.tennis.exception.RegistrationAlreadyExistsException;
import com.catalin.tennis.exception.RegistrationNotFoundException;
import com.catalin.tennis.exception.TournamentNotFoundException;
import com.catalin.tennis.exception.UserNotFoundException;
import com.catalin.tennis.model.Registration;
import com.catalin.tennis.model.Tournament;
import com.catalin.tennis.model.User;
import com.catalin.tennis.repository.RegistrationRepository;
import com.catalin.tennis.repository.TournamentRepository;
import com.catalin.tennis.repository.UserRepository;
import com.catalin.tennis.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class RegistrationServiceImpl implements RegistrationService {
    private final RegistrationRepository registrationRepository;
    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;

    @Autowired
    public RegistrationServiceImpl(RegistrationRepository registrationRepository, TournamentRepository tournamentRepository, UserRepository userRepository){
        this.registrationRepository=registrationRepository;
        this.tournamentRepository=tournamentRepository;
        this.userRepository=userRepository;
    }
    @Override
    public RegistrationResponseDTO registerPlayer(RegistrationRequestDTO dto) {
        User user = userRepository.findById(dto.getPlayerId()).orElseThrow(
                () -> new UserNotFoundException("User with this Id doesn't exist")
        );
        Tournament tournament = tournamentRepository.findById(dto.getTournamentId()).orElseThrow(
                () -> new TournamentNotFoundException("Tournament with this id doesn't exist")
        );
        if(registrationRepository.existsByPlayerAndTournament(user,tournament)){
            throw new RegistrationAlreadyExistsException("The player is already registered for this tournament");
        }
        Registration registration = Registration.builder()
                .player(user)
                .tournament(tournament)
                .registrationDate(LocalDateTime.now())
                .build();
        registrationRepository.save(registration);
        return new RegistrationResponseDTO(
                user.getName(),
                tournament.getName(),
                registration.getRegistrationDate()
        );
    }

    @Override
    public List<RegistrationResponseDTO> getRegistrationsByPlayer(Long playerId) {
        User user = userRepository.findById(playerId).orElseThrow(
                () -> new UserNotFoundException("User with this Id doesn't exist")
        );
        List<Registration> registrations=registrationRepository.findByPlayer(user);
        if(registrations.isEmpty()){
            throw new RegistrationNotFoundException("This user is not registered for any tournament");
        }

        return responseDTOListRegistrationList(registrations);
    }

    @Override
    public List<RegistrationResponseDTO> getRegistrationsByTournament(Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId).orElseThrow(
                () -> new TournamentNotFoundException("Tournament with this id doesn't exist")
        );
        List<Registration> registrations=registrationRepository.findByTournament(tournament);
        if(registrations.isEmpty()){
            throw new RegistrationNotFoundException("No registrations for this tournament");
        }
        return responseDTOListRegistrationList(registrations);
    }

    private List<RegistrationResponseDTO> responseDTOListRegistrationList(List<Registration> registrations){
        List<RegistrationResponseDTO> dtos=new ArrayList<>();
        for(Registration r: registrations){
            dtos.add(new RegistrationResponseDTO(
                    r.getPlayer().getName(),
                    r.getTournament().getName(),
                    r.getRegistrationDate()
                    )
            );
        }
        return dtos;
    }
}
