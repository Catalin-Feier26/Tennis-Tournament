package com.catalin.tennis.repository;

import com.catalin.tennis.model.User;
import com.catalin.tennis.model.enums.UserRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{
    Optional<User> findByUsername(String username);
    List<User> findAllByName(String name);
    List<User> findAllByCreatedAt(LocalDateTime createdAt);
    List<User> findAllByRole(UserRoles role);
    boolean existsUserByUsername(String username);

}
