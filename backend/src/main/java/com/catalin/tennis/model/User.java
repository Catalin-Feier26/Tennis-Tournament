package com.catalin.tennis.model;

import com.catalin.tennis.model.enums.UserRoles;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name="users")
@NoArgsConstructor
@AllArgsConstructor
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

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Registration> registrations = new ArrayList<>();

    @OneToMany(mappedBy = "player1", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> matchesAsPlayer1 = new ArrayList<>();

    @OneToMany(mappedBy = "player2", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> matchesAsPlayer2 = new ArrayList<>();

    @OneToMany(mappedBy = "referee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> matchesAsReferee = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications = new ArrayList<>();


    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private String username;
        private String passwordHash;
        private UserRoles role;
        private String name;
        private LocalDateTime createdAt;

        public UserBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UserBuilder passwordHash(String passwordHash) {
            this.passwordHash = passwordHash;
            return this;
        }

        public UserBuilder role(UserRoles role) {
            this.role = role;
            return this;
        }

        public UserBuilder name(String name) {
            this.name = name;
            return this;
        }

        public UserBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public User build() {
            User user = new User();
            user.setUsername(this.username);
            user.setPasswordHash(this.passwordHash);
            user.setRole(this.role);
            user.setName(this.name);
            user.setCreatedAt(this.createdAt);
            return user;
        }
    }
}
