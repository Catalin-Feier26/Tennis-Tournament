package com.catalin.tennis.service.implementations;

import com.catalin.tennis.dto.request.CreateMatchDTO;
import com.catalin.tennis.dto.request.UpdateScoreDTO;
import com.catalin.tennis.dto.response.MatchResponseDTO;
import com.catalin.tennis.exception.MatchAlreadyExistsException;
import com.catalin.tennis.exception.MatchNotFoundException;
import com.catalin.tennis.exception.TournamentNotFoundException;
import com.catalin.tennis.exception.UserNotFoundException;
import com.catalin.tennis.factory.MatchFactory;
import com.catalin.tennis.model.Match;
import com.catalin.tennis.model.Tournament;
import com.catalin.tennis.model.User;
import com.catalin.tennis.repository.MatchRepository;
import com.catalin.tennis.repository.TournamentRepository;
import com.catalin.tennis.repository.UserRepository;
import com.catalin.tennis.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

@Service
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;
    private static final Logger logger = LoggerFactory.getLogger(MatchServiceImpl.class);

    @Autowired
    public MatchServiceImpl(MatchRepository matchRepository, UserRepository userRepository, TournamentRepository tournamentRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.tournamentRepository = tournamentRepository;
    }

    @Override
    public MatchResponseDTO createMatch(CreateMatchDTO dto) {
        logger.info("Creating match with DTO: {}", dto);

        if (matchRepository.existsByPlayer1_IdAndPlayer2_IdAndReferee_IdAndTournament_IdAndStartDate(
                dto.getPlayer1Id(), dto.getPlayer2Id(), dto.getRefereeId(), dto.getTournamentId(), dto.getStartDate())) {
            logger.error("Match already exists with players {}, {}, referee {}, tournament {}, start date {}",
                    dto.getPlayer1Id(), dto.getPlayer2Id(), dto.getRefereeId(), dto.getTournamentId(), dto.getStartDate());
            throw new MatchAlreadyExistsException("THIS match already exists in the tournament");
        }

        User player1 = userRepository.findById(dto.getPlayer1Id())
                .orElseThrow(() -> {
                    logger.error("Player1 not found for ID: {}", dto.getPlayer1Id());
                    return new UserNotFoundException("Player1 not found");
                });
        User player2 = userRepository.findById(dto.getPlayer2Id())
                .orElseThrow(() -> {
                    logger.error("Player2 not found for ID: {}", dto.getPlayer2Id());
                    return new UserNotFoundException("Player2 not found");
                });
        User referee = userRepository.findById(dto.getRefereeId())
                .orElseThrow(() -> {
                    logger.error("Referee not found for ID: {}", dto.getRefereeId());
                    return new UserNotFoundException("Referee not found");
                });
        Tournament tournament = tournamentRepository.findById(dto.getTournamentId())
                .orElseThrow(() -> {
                    logger.error("Tournament not found for ID: {}", dto.getTournamentId());
                    return new TournamentNotFoundException("Tournament was not found");
                });

        // Create a match using the factory, which may throw an exception if conditions aren't met
        Match match;
        try {
            match = MatchFactory.createMatch(player1, player2, referee, tournament, dto.getCourtNumber(), dto.getStartDate());
        } catch (IllegalArgumentException ex) {
            logger.error("Error in MatchFactory: {}", ex.getMessage());
            throw ex;
        }

        matchRepository.save(match);
        logger.info("Match created with ID: {}", match.getId());

        return new MatchResponseDTO(
                match.getId(),
                match.getPlayer1().getUsername(),
                match.getPlayer2().getUsername(),
                match.getReferee().getUsername(),
                match.getTournament().getName(),
                match.getScorePlayer1(),
                match.getScorePlayer2(),
                match.getCourtNumber(),
                match.getStartDate()
        );
    }
    @Override
    public void deleteMatchById(Long id) {
        matchRepository.deleteById(id);
    }

    @Override
    public MatchResponseDTO updateScore(UpdateScoreDTO dto) {
        Match match = matchRepository.findById(dto.getMatchId())
                .orElseThrow(() -> new MatchNotFoundException("Match not found with id: " + dto.getMatchId()));

        if (dto.getScorePlayer1() < 0 || dto.getScorePlayer2() < 0) {
            throw new IllegalArgumentException("Scores must be zero or positive.");
        }

        match.setScorePlayer1(dto.getScorePlayer1());
        match.setScorePlayer2(dto.getScorePlayer2());
        matchRepository.save(match);

        return new MatchResponseDTO(
                match.getId(),
                match.getPlayer1().getUsername(),
                match.getPlayer2().getUsername(),
                match.getReferee().getUsername(),
                match.getTournament().getName(),
                match.getScorePlayer1(),
                match.getScorePlayer2(),
                match.getCourtNumber(),
                match.getStartDate()
        );
    }

    @Override
    public List<MatchResponseDTO> getMatchesByTournament(Long tournamentId) {
        List<Match> matches = matchRepository.findByTournament_Id(tournamentId);
        if (matches.isEmpty()) {
            return new ArrayList<>();
        }
        return matchListToMatchResponseList(matches);
    }

    @Override
    public List<MatchResponseDTO> getMatchesByRefereeUsername(String username) {
        User referee = userRepository.findByUsername(username).orElseThrow(
                () -> new UserNotFoundException("Referee not found")
        );
        List<Match> matches = matchRepository.findAllByReferee(referee);
        if (matches.isEmpty()) {
            return new ArrayList<>();
        }
        return matchListToMatchResponseList(matches);
    }

    @Override
    public List<MatchResponseDTO> getMatchesByPlayer(String username) {
        User player = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Player not found"));
        List<Match> matches = matchRepository.findByPlayer1OrPlayer2(player, player);
        if (matches.isEmpty()) {
            return new ArrayList<>();
        }
        return matchListToMatchResponseList(matches);
    }

    private List<MatchResponseDTO> matchListToMatchResponseList(List<Match> matches) {
        List<MatchResponseDTO> matchResponseDTOS = new ArrayList<>();
        for (Match m : matches) {
            matchResponseDTOS.add(new MatchResponseDTO(
                    m.getId(),
                    m.getPlayer1().getUsername(),
                    m.getPlayer2().getUsername(),
                    m.getReferee().getUsername(),
                    m.getTournament().getName(),
                    m.getScorePlayer1(),
                    m.getScorePlayer2(),
                    m.getCourtNumber(),
                    m.getStartDate()
            ));
        }
        return matchResponseDTOS;
    }
}
