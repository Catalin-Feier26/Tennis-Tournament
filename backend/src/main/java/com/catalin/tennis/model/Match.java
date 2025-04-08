package com.catalin.tennis.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "matches")
@NoArgsConstructor
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player1_id", nullable = false)
    private User player1;

    @ManyToOne
    @JoinColumn(name = "player2_id", nullable = false)
    private User player2;

    @ManyToOne
    @JoinColumn(name = "referee_id", nullable = false)
    private User referee;

    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;


    @ElementCollection
    @CollectionTable(name = "match_sets", joinColumns = @JoinColumn(name = "match_id"))
    private List<SetScore> sets;

    @Column(name = "court_number", nullable = false)
    private Integer courtNumber;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    public static MatchBuilder builder() {
        return new MatchBuilder();
    }

    public static class MatchBuilder {
        private User player1;
        private User player2;
        private User referee;
        private Tournament tournament;
        private List<SetScore> sets;
        private Integer courtNumber;
        private LocalDateTime startDate;

        public MatchBuilder player1(User player1) {
            this.player1 = player1;
            return this;
        }

        public MatchBuilder player2(User player2) {
            this.player2 = player2;
            return this;
        }

        public MatchBuilder referee(User referee) {
            this.referee = referee;
            return this;
        }

        public MatchBuilder tournament(Tournament tournament) {
            this.tournament = tournament;
            return this;
        }

        public MatchBuilder sets(List<SetScore> sets) {
            this.sets = sets;
            return this;
        }

        public MatchBuilder courtNumber(Integer courtNumber) {
            this.courtNumber = courtNumber;
            return this;
        }

        public MatchBuilder startDate(LocalDateTime startDate) {
            this.startDate = startDate;
            return this;
        }

        public Match build() {
            Match match = new Match();
            match.setPlayer1(this.player1);
            match.setPlayer2(this.player2);
            match.setReferee(this.referee);
            match.setTournament(this.tournament);
            match.setSets(this.sets);
            match.setCourtNumber(this.courtNumber);
            match.setStartDate(this.startDate);
            return match;
        }
    }
}
