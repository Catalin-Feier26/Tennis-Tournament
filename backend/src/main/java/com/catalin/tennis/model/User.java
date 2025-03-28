package com.catalin.tennis.model;

import com.catalin.tennis.model.enums.UserRoles;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name="users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name="password_hash",nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role",nullable = false)
    private UserRoles role;

    @Column(name ="name",nullable = false)
    private String name;

    @Column(name="created_at",nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
