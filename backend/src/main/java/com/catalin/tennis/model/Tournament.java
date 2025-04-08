package com.catalin.tennis.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="tournaments")
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="tournament_id")
    private Long id;

    @NotBlank(message = "Tournament name is required")
    @Column(name="tournament_name", nullable = false, unique = true)
    private String name;

    @FutureOrPresent(message = "Start date must be present or future")
    @Column(name="start_date", nullable = false)
    private LocalDate startDate;

    @FutureOrPresent(message = "End date must be present or future")
    @Column(name="end_date", nullable = false)
    private LocalDate endDate;

    @Column(name="registration_deadline")
    private LocalDate registrationDeadline;

    @Column(name = "max_participants", nullable = false)
    private int maxParticipants;

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> matches = new ArrayList<>();

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Registration> registrations = new ArrayList<>();

    public static TournamentBuilder builder(){
        return new TournamentBuilder();
    }

    public static class TournamentBuilder{
        private String name;
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalDate registrationDeadline;
        private int maxParticipants;

        public TournamentBuilder name(String name){
            this.name = name;
            return this;
        }
        public TournamentBuilder startDate(LocalDate startDate){
            this.startDate = startDate;
            return this;
        }
        public TournamentBuilder endDate(LocalDate endDate){
            this.endDate = endDate;
            return this;
        }
        public TournamentBuilder registrationDeadline(LocalDate registrationDeadline){
            this.registrationDeadline = registrationDeadline;
            return this;
        }
        public TournamentBuilder maxParticipants(int maxParticipants) {
            this.maxParticipants = maxParticipants;
            return this;
        }
        public Tournament build(){
            Tournament tournament = new Tournament();
            tournament.setName(this.name);
            tournament.setStartDate(this.startDate);
            tournament.setEndDate(this.endDate);
            tournament.setRegistrationDeadline(this.registrationDeadline);
            tournament.setMaxParticipants(this.maxParticipants);
            return tournament;
        }
    }
}
