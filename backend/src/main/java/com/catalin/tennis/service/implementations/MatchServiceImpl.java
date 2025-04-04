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

import java.util.ArrayList;
import java.util.List;

@Service
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;

    @Autowired
    public MatchServiceImpl(MatchRepository matchRepository, UserRepository userRepository, TournamentRepository tournamentRepository ){
        this.matchRepository=matchRepository;
        this.userRepository = userRepository;
        this.tournamentRepository = tournamentRepository;
    }

    @Override
    public MatchResponseDTO createMatch(CreateMatchDTO dto) {
        if(matchRepository.existsByPlayer1_IdAndPlayer2_IdAndReferee_IdAndTournament_IdAndStartDate
                (dto.getPlayer1Id(),dto.getPlayer2Id(),dto.getRefereeId(),dto.getTournamentId(),dto.getStartDate()))
                    throw new MatchAlreadyExistsException("THIS match already exists in the tournament");
        User player1 = userRepository.findById(dto.getPlayer1Id()).orElseThrow(
                () -> new UserNotFoundException("Player1 not found")
        );
        User player2 = userRepository.findById(dto.getPlayer2Id()).orElseThrow(
                () -> new UserNotFoundException("Player2 not found")
        );
        User referee = userRepository.findById(dto.getRefereeId()).orElseThrow(
                () -> new UserNotFoundException("Referee not found")
        );
        Tournament tournament=tournamentRepository.findById(dto.getTournamentId()).orElseThrow(
                () -> new TournamentNotFoundException("Tournament was not found")
        );
        Match match=MatchFactory.createMatch(
                player1,
                player2,
                referee,
                tournament,
                dto.getStartDate()
        );
        matchRepository.save(match);
        return new MatchResponseDTO(
                match.getPlayer1().getName(),
                match.getPlayer2().getName(),
                match.getReferee().getName(),
                match.getTournament().getName(),
                match.getScorePlayer1(),
                match.getScorePlayer2(),
                match.getStartDate()
        );
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
                match.getPlayer1().getName(),
                match.getPlayer2().getName(),
                match.getReferee().getName(),
                match.getTournament().getName(),
                match.getScorePlayer1(),
                match.getScorePlayer2(),
                match.getStartDate()
        );
    }


    @Override
    public List<MatchResponseDTO> getMatchesByTournament(Long tournamentId) {
        List<Match> matches=matchRepository.findByTournament_Id(tournamentId);
        if(matches.isEmpty()){
            throw new MatchNotFoundException("No matches in this tournament");
        }
        List<MatchResponseDTO> matchResponseDTOS=matchListToMatchResponseList(matches);
        return matchResponseDTOS;
    }

    @Override
    public List<MatchResponseDTO> getMatchesByReferee(Long refereeId) {
        List<Match> matches=matchRepository.findByReferee_Id(refereeId);
        if(matches.isEmpty()){
            throw new MatchNotFoundException("No matches are having this referee");
        }
        List<MatchResponseDTO> matchResponseDTOS=matchListToMatchResponseList(matches);
        return matchResponseDTOS;
    }

    @Override
    public List<MatchResponseDTO> getMatchesByPlayer(Long playerId) {
        User player = userRepository.findById(playerId).orElseThrow(
                () -> new UserNotFoundException("Player not found")
        );
        List<Match> matches=matchRepository.findByPlayer1OrPlayer2(player,player);
        if(matches.isEmpty()){
            throw new MatchNotFoundException("No matches for this player");
        }
        List<MatchResponseDTO> dtos =matchListToMatchResponseList(matches);
        return dtos;
    }

    private List<MatchResponseDTO> matchListToMatchResponseList(List<Match> matches){
        List<MatchResponseDTO> matchResponseDTOS=new ArrayList<>();
        for(Match m: matches){
            matchResponseDTOS.add(
                    new MatchResponseDTO(
                            m.getPlayer1().getName(),
                            m.getPlayer2().getName(),
                            m.getReferee().getName(),
                            m.getTournament().getName(),
                            m.getScorePlayer1(),
                            m.getScorePlayer2(),
                            m.getStartDate()
                    )
            );
        }
        return matchResponseDTOS;
    }
}
