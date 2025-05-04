package com.catalin.tennis;

import com.catalin.tennis.dto.request.CreateTournamentDTO;
import com.catalin.tennis.dto.response.TournamentResponseDTO;
import com.catalin.tennis.exception.TournamentNameTakenException;
import com.catalin.tennis.exception.TournamentNotFoundException;
import com.catalin.tennis.model.Tournament;
import com.catalin.tennis.repository.TournamentRepository;
import com.catalin.tennis.service.implementations.TournamentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TournamentServiceTest {

    @Mock
    private TournamentRepository tournamentRepository;

    @InjectMocks
    private TournamentServiceImpl tournamentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTournament_success() {
        CreateTournamentDTO dto = new CreateTournamentDTO("Open", LocalDate.now(), LocalDate.now().plusDays(5), LocalDate.now().minusDays(1), 16);

        when(tournamentRepository.existsByName("Open")).thenReturn(false);
        when(tournamentRepository.save(any())).thenAnswer(i -> {
            Tournament t = (Tournament) i.getArguments()[0];
            t.setId(1L);
            return t;
        });

        TournamentResponseDTO response = tournamentService.createTournament(dto);
        assertNotNull(response);
        assertEquals("Open", response.getName());
    }

    @Test
    void createTournament_nameTaken_throwsException() {
        CreateTournamentDTO dto = new CreateTournamentDTO("Open", LocalDate.now(), LocalDate.now().plusDays(5), LocalDate.now().minusDays(1), 16);

        when(tournamentRepository.existsByName("Open")).thenReturn(true);

        assertThrows(TournamentNameTakenException.class,
                () -> tournamentService.createTournament(dto));
    }

    @Test
    void deleteTournament_success() {
        Tournament t = new Tournament();
        t.setId(1L);

        when(tournamentRepository.findById(1L)).thenReturn(Optional.of(t));

        assertDoesNotThrow(() -> tournamentService.deleteTournament(1L));
        verify(tournamentRepository).delete(t);
    }

    @Test
    void deleteTournament_notFound_throwsException() {
        when(tournamentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(TournamentNotFoundException.class,
                () -> tournamentService.deleteTournament(1L));
    }

    @Test
    void getAllTournaments_success() {
        Tournament t = new Tournament();
        t.setId(1L);
        t.setName("Open");

        when(tournamentRepository.findAll()).thenReturn(List.of(t));

        List<TournamentResponseDTO> result = tournamentService.getAllTournaments();
        assertFalse(result.isEmpty());
    }

    @Test
    void getAllTournaments_empty_throwsException() {
        when(tournamentRepository.findAll()).thenReturn(Collections.emptyList());

        assertThrows(TournamentNotFoundException.class,
                () -> tournamentService.getAllTournaments());
    }

    @Test
    void getTournamentByName_success() {
        Tournament t = new Tournament();
        t.setId(1L);
        t.setName("Open");

        when(tournamentRepository.existsByName("Open")).thenReturn(true);
        when(tournamentRepository.findByName("Open")).thenReturn(Optional.of(t));

        TournamentResponseDTO result = tournamentService.getTournamentByName("Open");
        assertEquals("Open", result.getName());
    }

    @Test
    void getTournamentByName_notFound_throwsException() {
        when(tournamentRepository.existsByName("Open")).thenReturn(false);

        assertThrows(TournamentNotFoundException.class,
                () -> tournamentService.getTournamentByName("Open"));
    }

    @Test
    void getTournamentsStartingAfter_success() {
        Tournament t = new Tournament();
        t.setId(1L);
        t.setName("Future Cup");
        t.setStartDate(LocalDate.now().plusDays(10));

        when(tournamentRepository.findAll()).thenReturn(List.of(t));

        List<TournamentResponseDTO> result = tournamentService.getTournamentsStartingAfter(LocalDate.now().toString());
        assertFalse(result.isEmpty());
    }

    @Test
    void getTournamentsStartingAfter_empty_throwsException() {
        Tournament t = new Tournament();
        t.setStartDate(LocalDate.now());

        when(tournamentRepository.findAll()).thenReturn(List.of(t));

        assertThrows(TournamentNotFoundException.class,
                () -> tournamentService.getTournamentsStartingAfter(LocalDate.now().plusDays(1).toString()));
    }
}
