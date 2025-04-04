package com.catalin.tennis.repository;

import com.catalin.tennis.model.Match;
import com.catalin.tennis.model.Tournament;
import com.catalin.tennis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findMatchByTournament(Tournament tournament);
    List<Match> findByTournament_Id(Long tournamentId);
    List<Match> findByReferee_Id(Long refereeId);
    List<Match> findAllByReferee(User referee);
    List<Match> findByPlayer1OrPlayer2(User player1, User player2);
    boolean existsByPlayer1_IdAndPlayer2_IdAndReferee_IdAndTournament_IdAndStartDate(
            Long p1, Long p2, Long ref, Long tourId, LocalDateTime date);

}
