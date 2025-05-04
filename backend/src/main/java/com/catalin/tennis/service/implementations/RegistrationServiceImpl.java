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
import com.catalin.tennis.model.enums.RegistrationStatus;
import com.catalin.tennis.repository.RegistrationRepository;
import com.catalin.tennis.repository.TournamentRepository;
import com.catalin.tennis.repository.UserRepository;
import com.catalin.tennis.service.NotificationService;
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
    private final NotificationService notificationService;

    @Autowired
    public RegistrationServiceImpl(RegistrationRepository registrationRepository, TournamentRepository tournamentRepository, UserRepository userRepository, NotificationService notificationService){
        this.registrationRepository=registrationRepository;
        this.tournamentRepository=tournamentRepository;
        this.userRepository=userRepository;
        this.notificationService=notificationService;
    }
    @Override
    public RegistrationResponseDTO registerPlayer(RegistrationRequestDTO dto) {
        User user = userRepository.findByUsername(dto.getPlayerUsername())
                .orElseThrow(() -> new UserNotFoundException("User with this username doesn't exist"));

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
                .status(RegistrationStatus.PENDING)
                .build();
        registrationRepository.save(registration);
        return new RegistrationResponseDTO(
                registration.getId(),
                user.getName(),
                tournament.getName(),
                registration.getRegistrationDate(),
                registration.getStatus()
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
        List<Registration> registrations = registrationRepository.findByTournamentAndStatus(tournament, RegistrationStatus.APPROVED);
        if(registrations.isEmpty()){
            throw new RegistrationNotFoundException("No registrations for this tournament");
        }
        return responseDTOListRegistrationList(registrations);
    }

    private List<RegistrationResponseDTO> responseDTOListRegistrationList(List<Registration> registrations){
        List<RegistrationResponseDTO> dtos=new ArrayList<>();
        for(Registration r: registrations){
            dtos.add(new RegistrationResponseDTO(
                    r.getId(),
                    r.getPlayer().getUsername(),
                    r.getTournament().getName(),
                    r.getRegistrationDate(),
                    r.getStatus()
                    )
            );
        }
        return dtos;
    }
    public void approveRegistration(Long registrationId) {
        Registration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RegistrationNotFoundException("Not found"));
        reg.setStatus(RegistrationStatus.APPROVED);
        registrationRepository.save(reg);
        notificationService.createNotification(reg.getPlayer().getUsername(), "Your registration for " + reg.getTournament().getName() + " has been approved.");
    }

    public void denyRegistration(Long registrationId) {
        Registration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RegistrationNotFoundException("Not found"));
        reg.setStatus(RegistrationStatus.DENIED);
        registrationRepository.save(reg);
        notificationService.createNotification(reg.getPlayer().getUsername(), "Your registration for " + reg.getTournament().getName() + " was denied.");
    }
    @Override
    public List<RegistrationResponseDTO> getPendingRegistrationsByTournament(Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new TournamentNotFoundException("Tournament not found"));

        List<Registration> registrations = registrationRepository.findByTournamentAndStatus(tournament, RegistrationStatus.PENDING);
        if (registrations.isEmpty()) {
            throw new RegistrationNotFoundException("No pending registrations for this tournament");
        }
        return responseDTOListRegistrationList(registrations);
    }


}
