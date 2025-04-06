package com.catalin.tennis.factory;


import com.catalin.tennis.model.Tournament;

import java.time.LocalDate;

public class TournamentFactory {
    public static Tournament createTournament(String name, LocalDate startDate, LocalDate endDate, LocalDate registrationDeadline, int maxParticipants){
        return Tournament.builder()
                .name(name)
                .startDate(startDate)
                .endDate(endDate)
                .registrationDeadline(registrationDeadline)
                .maxParticipants(maxParticipants)
                .build();
    }
}
