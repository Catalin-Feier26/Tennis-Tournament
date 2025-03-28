package com.catalin.tennis.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
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
@Builder
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="tournament_id")
    private Long id;

    @Column(name="tournament_name",nullable = false, unique = true)
    private String name;

    @FutureOrPresent
    @Column(name="start_date",nullable = false)
    private LocalDate startDate;

    @FutureOrPresent
    @Column(name="end_date",nullable = false)
    private LocalDate endDate;

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> matches = new ArrayList<>();

}
