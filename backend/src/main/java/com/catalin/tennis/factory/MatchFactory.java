package com.catalin.tennis.factory;

import com.catalin.tennis.model.Match;
import com.catalin.tennis.model.Tournament;
import com.catalin.tennis.model.User;

import java.time.LocalDateTime;
import java.util.Collections;

public class MatchFactory {
    public static Match createMatch(User player1, User player2, User referee, Tournament tournament, Integer courtNumber, LocalDateTime startDate) {
        if(player1.equals(player2)){
            throw new IllegalArgumentException("A player cannot be against themselves");
        }
        if(player1.equals(referee) || player2.equals(referee)){
            throw  new IllegalArgumentException("A player cannot be its own referee in a match");
        }
        return Match.builder()
                .player1(player1)
                .player2(player2)
                .referee(referee)
                .tournament(tournament)
                .sets(Collections.emptyList())
                .courtNumber(courtNumber)
                .startDate(startDate)
                .build();

    }
}
