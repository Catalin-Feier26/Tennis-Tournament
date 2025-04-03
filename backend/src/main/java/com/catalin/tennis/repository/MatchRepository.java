package com.catalin.tennis.repository;

import com.catalin.tennis.model.Match;
import com.catalin.tennis.model.Tournament;
import com.catalin.tennis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findMatchByTournament(Tournament tournament);
    List<Match> findByTournament_Id(Long tournamentId);

    List<Match> findAllByReferee(User referee);
    List<Match> findByPlayer1OrPlayer2(User player1, User player2);
}
