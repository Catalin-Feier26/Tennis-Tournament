package com.catalin.tennis.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name="matches")
@NoArgsConstructor
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name="player1_id", nullable = false)
    private User player1;

    @ManyToOne
    @JoinColumn(name="player2_id",nullable = false)
    private User player2;

    @ManyToOne
    @JoinColumn(name = "referee_id", nullable = false)
    private User referee;

    @ManyToOne
    @JoinColumn(name="tournament_id",nullable = false)
    private Tournament tournament;

    @Column(name = "score_player1")
    private Integer scorePlayer1;

    @Column(name="score_player2")
    private Integer scorePlayer2;

    @Column(name="start_date",nullable = false)
    private LocalDateTime startDate;

    public static MatchBuilder builder() {
        return new MatchBuilder();
    }

    public static class MatchBuilder {
        private User player1;
        private User player2;
        private User referee;
        private Tournament tournament;
        private Integer scorePlayer1;
        private Integer scorePlayer2;
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

        public MatchBuilder scorePlayer1(Integer scorePlayer1) {
            this.scorePlayer1 = scorePlayer1;
            return this;
        }

        public MatchBuilder scorePlayer2(Integer scorePlayer2) {
            this.scorePlayer2 = scorePlayer2;
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
            match.setScorePlayer1(this.scorePlayer1);
            match.setScorePlayer2(this.scorePlayer2);
            match.setStartDate(this.startDate);
            return match;
        }
    }
}
