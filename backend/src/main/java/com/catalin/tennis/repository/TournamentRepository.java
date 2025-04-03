package com.catalin.tennis.repository;

import com.catalin.tennis.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    Optional<Tournament> findByName(String name);
    boolean existsByName(String name);
    List<Tournament> findAllByStartDate(LocalDate startDate);
    List<Tournament> findAllByEndDate(LocalDate endDate);
    List<Tournament> findAllByStartDateAfter(LocalDate date);
    List<Tournament> findAllByEndDateBefore(LocalDate date);
}
