package com.catalin.tennis.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name="matches")
@Builder
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
}
