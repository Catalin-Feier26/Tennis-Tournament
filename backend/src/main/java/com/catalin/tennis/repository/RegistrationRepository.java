package com.catalin.tennis.repository;

import com.catalin.tennis.model.Registration;
import com.catalin.tennis.model.Tournament;
import com.catalin.tennis.model.User;
import com.catalin.tennis.model.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    boolean existsByPlayerAndTournament(User player, Tournament tournament);
    List<Registration> findByPlayer(User player);
    List<Registration> findByTournament(Tournament tournament);
    List<Registration> findByTournamentAndStatus(Tournament tournament, RegistrationStatus status);

}
