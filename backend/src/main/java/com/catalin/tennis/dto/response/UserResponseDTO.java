package com.catalin.tennis.dto.response;

import com.catalin.tennis.model.enums.UserRoles;
import lombok.AllArgsConstructor;
import lombok.Data;


@AllArgsConstructor
@Data
public class UserResponseDTO {
    private String username;
    private String name;
    private UserRoles role;
}
