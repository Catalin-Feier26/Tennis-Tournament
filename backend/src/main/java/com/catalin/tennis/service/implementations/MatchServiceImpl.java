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
import com.catalin.tennis.model.SetScore;
import com.catalin.tennis.model.Tournament;
import com.catalin.tennis.model.User;
import com.catalin.tennis.repository.MatchRepository;
import com.catalin.tennis.repository.TournamentRepository;
import com.catalin.tennis.repository.UserRepository;
import com.catalin.tennis.service.MatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
            logger.error("Match already exists.");
            throw new MatchAlreadyExistsException("This match already exists in the tournament.");
        }

        User player1 = userRepository.findById(dto.getPlayer1Id())
                .orElseThrow(() -> new UserNotFoundException("Player1 not found"));
        User player2 = userRepository.findById(dto.getPlayer2Id())
                .orElseThrow(() -> new UserNotFoundException("Player2 not found"));
        User referee = userRepository.findById(dto.getRefereeId())
                .orElseThrow(() -> new UserNotFoundException("Referee not found"));
        Tournament tournament = tournamentRepository.findById(dto.getTournamentId())
                .orElseThrow(() -> new TournamentNotFoundException("Tournament not found"));

        Match match = MatchFactory.createMatch(player1, player2, referee, tournament, dto.getCourtNumber(), dto.getStartDate());
        match.setSets(dto.getSets());
        matchRepository.save(match);
        logger.info("Match saved successfully");

        return convertToDTO(match);
    }

    @Override
    public MatchResponseDTO updateScore(UpdateScoreDTO dto) {
        Match match = matchRepository.findById(dto.getMatchId())
                .orElseThrow(() -> new MatchNotFoundException("Match not found"));

        match.setSets(dto.getSets());
        matchRepository.save(match);

        return convertToDTO(match);
    }

    @Override
    public void deleteMatchById(Long id) {
        matchRepository.deleteById(id);
    }

    @Override
    public List<MatchResponseDTO> getMatchesByTournament(Long tournamentId) {
        List<Match> matches = matchRepository.findByTournament_Id(tournamentId);
        return matchListToDTOList(matches);
    }

    @Override
    public List<MatchResponseDTO> getMatchesByRefereeUsername(String username) {
        User referee = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Referee not found"));
        List<Match> matches = matchRepository.findAllByReferee(referee);
        return matchListToDTOList(matches);
    }

    @Override
    public List<MatchResponseDTO> getMatchesByPlayer(String username) {
        User player = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Player not found"));
        List<Match> matches = matchRepository.findByPlayer1OrPlayer2(player, player);
        return matchListToDTOList(matches);
    }

    private List<MatchResponseDTO> matchListToDTOList(List<Match> matches) {
        List<MatchResponseDTO> dtos = new ArrayList<>();
        for (Match m : matches) {
            dtos.add(convertToDTO(m));
        }
        return dtos;
    }

    private MatchResponseDTO convertToDTO(Match m) {
        return new MatchResponseDTO(
                m.getId(),
                m.getPlayer1().getUsername(),
                m.getPlayer2().getUsername(),
                m.getReferee().getUsername(),
                m.getTournament().getName(),
                m.getCourtNumber(),
                m.getStartDate(),
                m.getSets()
        );
    }
    @Override
    public byte[] exportMatchesToCsvByTournament(Long tournamentId) {
        List<Match> matches = matchRepository.findByTournament_Id(tournamentId);

        StringBuilder csvBuilder = new StringBuilder();
        csvBuilder.append("Match ID,Player 1,Player 2,Referee,Court,Start Date,Set Scores\n");

        for (Match match : matches) {
            String sets = match.getSets().stream()
                    .map(s -> s.getPlayer1Games() + "-" + s.getPlayer2Games())
                    .collect(Collectors.joining(" | "));

            csvBuilder.append(String.format("%d,%s,%s,%s,%d,%s,%s\n",
                    match.getId(),
                    match.getPlayer1().getUsername(),
                    match.getPlayer2().getUsername(),
                    match.getReferee().getUsername(),
                    match.getCourtNumber(),
                    match.getStartDate(),
                    sets
            ));
        }

        return csvBuilder.toString().getBytes(StandardCharsets.UTF_8);
    }


}
