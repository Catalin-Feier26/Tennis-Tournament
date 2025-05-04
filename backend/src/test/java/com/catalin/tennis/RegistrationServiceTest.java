package com.catalin.tennis;

import com.catalin.tennis.dto.request.RegistrationRequestDTO;
import com.catalin.tennis.dto.response.RegistrationResponseDTO;
import com.catalin.tennis.exception.RegistrationAlreadyExistsException;
import com.catalin.tennis.exception.RegistrationNotFoundException;
import com.catalin.tennis.exception.TournamentNotFoundException;
import com.catalin.tennis.exception.UserNotFoundException;
import com.catalin.tennis.model.*;
import com.catalin.tennis.model.enums.RegistrationStatus;
import com.catalin.tennis.repository.*;
import com.catalin.tennis.service.NotificationService;
import com.catalin.tennis.service.implementations.RegistrationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RegistrationServiceTest {

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private TournamentRepository tournamentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private RegistrationServiceImpl registrationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerPlayer_success() {
        RegistrationRequestDTO dto = new RegistrationRequestDTO("john", 1L);
        User user = new User();
        Tournament tournament = new Tournament();

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(tournamentRepository.findById(1L)).thenReturn(Optional.of(tournament));
        when(registrationRepository.existsByPlayerAndTournament(user, tournament)).thenReturn(false);
        when(registrationRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        RegistrationResponseDTO response = registrationService.registerPlayer(dto);
        assertNotNull(response);
        assertEquals(RegistrationStatus.PENDING, response.getStatus());
    }

    @Test
    void registerPlayer_alreadyExists_throwsException() {
        RegistrationRequestDTO dto = new RegistrationRequestDTO("john", 1L);
        User user = new User();
        Tournament tournament = new Tournament();

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(tournamentRepository.findById(1L)).thenReturn(Optional.of(tournament));
        when(registrationRepository.existsByPlayerAndTournament(user, tournament)).thenReturn(true);

        assertThrows(RegistrationAlreadyExistsException.class,
                () -> registrationService.registerPlayer(dto));
    }

    @Test
    void approveRegistration_success() {
        User player = new User();
        player.setUsername("john");

        Tournament tournament = new Tournament();
        tournament.setName("Wimbledon");

        Registration reg = new Registration();
        reg.setId(1L);
        reg.setPlayer(player);
        reg.setTournament(tournament);

        when(registrationRepository.findById(1L)).thenReturn(Optional.of(reg));
        when(registrationRepository.save(any())).thenReturn(reg);

        assertDoesNotThrow(() -> registrationService.approveRegistration(1L));

        verify(notificationService).createNotification(eq("john"), contains("approved"));
    }

    @Test
    void denyRegistration_success() {
        User player = new User();
        player.setUsername("john");

        Tournament tournament = new Tournament();
        tournament.setName("Wimbledon");

        Registration reg = new Registration();
        reg.setId(1L);
        reg.setPlayer(player);
        reg.setTournament(tournament);

        when(registrationRepository.findById(1L)).thenReturn(Optional.of(reg));
        when(registrationRepository.save(any())).thenReturn(reg);

        assertDoesNotThrow(() -> registrationService.denyRegistration(1L));

        verify(notificationService).createNotification(eq("john"), contains("denied"));
    }


    @Test
    void getRegistrationsByPlayer_userNotFound_throwsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class,
                () -> registrationService.getRegistrationsByPlayer(1L));
    }

    @Test
    void getRegistrationsByTournament_tournamentNotFound_throwsException() {
        when(tournamentRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(TournamentNotFoundException.class,
                () -> registrationService.getRegistrationsByTournament(1L));
    }

    @Test
    void getPendingRegistrationsByTournament_tournamentNotFound_throwsException() {
        when(tournamentRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(TournamentNotFoundException.class,
                () -> registrationService.getPendingRegistrationsByTournament(1L));
    }
}
