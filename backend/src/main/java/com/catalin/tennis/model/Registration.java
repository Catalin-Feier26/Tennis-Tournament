package com.catalin.tennis.model;

import com.catalin.tennis.model.enums.RegistrationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="registrations")
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="registration_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name="player_id",nullable = false)
    private User player;

    @ManyToOne
    @JoinColumn(name="tournament_id",nullable = false)
    private Tournament tournament;

    @Column(name="registration_date",nullable = false)
    private LocalDateTime registrationDate;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status;
}
