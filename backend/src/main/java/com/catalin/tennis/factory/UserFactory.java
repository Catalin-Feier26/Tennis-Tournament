package com.catalin.tennis.factory;


import com.catalin.tennis.model.User;
import com.catalin.tennis.model.enums.UserRoles;

import java.time.LocalDateTime;

public class UserFactory {
    public static User createUser(String username, String encodedPassword, String name, UserRoles role){
        return User.builder()
                .username(username)
                .passwordHash(encodedPassword)
                .name(name)
                .role(role)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
