package com.catalin.tennis.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="registations")
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="registation_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name="player_id",nullable = false)
    private User player;

    @ManyToOne
    @JoinColumn(name="tournament_id",nullable = false)
    private Tournament tournament;

    @Column(name="registation_date",nullable = false)
    private LocalDateTime registrationDate;
}
