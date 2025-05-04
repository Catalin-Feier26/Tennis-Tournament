package com.catalin.tennis;

import com.catalin.tennis.dto.request.CreateMatchDTO;
import com.catalin.tennis.dto.request.UpdateScoreDTO;
import com.catalin.tennis.dto.response.MatchResponseDTO;
import com.catalin.tennis.exception.MatchAlreadyExistsException;
import com.catalin.tennis.exception.MatchNotFoundException;
import com.catalin.tennis.exception.UserNotFoundException;
import com.catalin.tennis.model.Match;
import com.catalin.tennis.model.Tournament;
import com.catalin.tennis.model.User;
import com.catalin.tennis.repository.MatchRepository;
import com.catalin.tennis.repository.TournamentRepository;
import com.catalin.tennis.repository.UserRepository;
import com.catalin.tennis.service.implementations.MatchServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MatchServiceTest {

    @Mock
    private MatchRepository matchRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TournamentRepository tournamentRepository;

    @InjectMocks
    private MatchServiceImpl matchService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createMatch_success() {
        CreateMatchDTO dto = new CreateMatchDTO();
        dto.setPlayer1Id(1L);
        dto.setPlayer2Id(2L);
        dto.setRefereeId(3L);
        dto.setTournamentId(4L);
        dto.setStartDate(LocalDateTime.now());

        when(matchRepository.existsByPlayer1_IdAndPlayer2_IdAndReferee_IdAndTournament_IdAndStartDate(
                anyLong(), anyLong(), anyLong(), anyLong(), any())).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User()));
        when(userRepository.findById(2L)).thenReturn(Optional.of(new User()));
        when(userRepository.findById(3L)).thenReturn(Optional.of(new User()));
        when(tournamentRepository.findById(4L)).thenReturn(Optional.of(new Tournament()));
        when(matchRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        MatchResponseDTO response = matchService.createMatch(dto);
        assertNotNull(response);
    }

    @Test
    void createMatch_alreadyExists_throwsException() {
        CreateMatchDTO dto = new CreateMatchDTO();
        dto.setPlayer1Id(1L);
        dto.setPlayer2Id(2L);
        dto.setRefereeId(3L);
        dto.setTournamentId(4L);
        dto.setStartDate(LocalDateTime.now());

        when(matchRepository.existsByPlayer1_IdAndPlayer2_IdAndReferee_IdAndTournament_IdAndStartDate(
                anyLong(), anyLong(), anyLong(), anyLong(), any())).thenReturn(true);

        assertThrows(MatchAlreadyExistsException.class, () -> matchService.createMatch(dto));
    }


    @Test
    void updateScore_notFound_throwsException() {
        UpdateScoreDTO dto = new UpdateScoreDTO();
        dto.setMatchId(1L);

        when(matchRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(MatchNotFoundException.class, () -> matchService.updateScore(dto));
    }

    @Test
    void getMatchesByRefereeUsername_userNotFound_throwsException() {
        when(userRepository.findByUsername("ref")).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class, () -> matchService.getMatchesByRefereeUsername("ref"));
    }

    @Test
    void getMatchesByPlayer_userNotFound_throwsException() {
        when(userRepository.findByUsername("player")).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class, () -> matchService.getMatchesByPlayer("player"));
    }
}
