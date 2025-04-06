package com.catalin.tennis.service;


import com.catalin.tennis.dto.request.CreateUserDTO;
import com.catalin.tennis.dto.request.LoginDTO;
import com.catalin.tennis.dto.request.RegisterUserDTO;
import com.catalin.tennis.dto.request.UpdateUserDTO;
import com.catalin.tennis.dto.response.UserResponseDTO;
import com.catalin.tennis.model.enums.UserRoles;

import java.util.List;
import java.util.Map;

public interface UserService {
    UserResponseDTO register(RegisterUserDTO dto);
    UserResponseDTO getUserByUsername(String username);
    UserResponseDTO updateUser(String username, UpdateUserDTO dto);
    void deleteUser(String username);
    List<UserResponseDTO> getUsersByRole(UserRoles role);
    List<UserResponseDTO> getUsersByName(String name);
    List<UserResponseDTO> getAllUsers();
    Map<String,String> login(LoginDTO loginDTO);

    UserResponseDTO createUser(CreateUserDTO createUserDTO);
}
