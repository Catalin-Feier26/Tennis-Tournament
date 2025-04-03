package com.catalin.tennis.service.implementations;

import com.catalin.tennis.dto.request.RegisterUserDTO;
import com.catalin.tennis.dto.response.UserResponseDTO;
import com.catalin.tennis.exception.UserNotFoundException;
import com.catalin.tennis.factory.UserFactory;
import com.catalin.tennis.model.User;
import com.catalin.tennis.model.enums.UserRoles;
import com.catalin.tennis.repository.UserRepository;
import com.catalin.tennis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository){
        this.userRepository=userRepository;
        this.passwordEncoder=new BCryptPasswordEncoder();
    }

    @Override
    public UserResponseDTO register(RegisterUserDTO dto) {

        if(userRepository.existsUserByUsername(dto.getUsername())){
            throw new IllegalArgumentException("User with this Username already exists");
        }

        String hashedPassword=passwordEncoder.encode(dto.getPassword());
        User user = UserFactory.createUser(
                dto.getUsername(),
                hashedPassword,
                dto.getName(),
                UserRoles.TENNIS_PLAYER
        );
        userRepository.save(user);
        return new UserResponseDTO(user.getUsername(),user.getName(),user.getRole());
    }

    @Override
    public UserResponseDTO getUserByUsername(String username) {
        if(!userRepository.existsUserByUsername(username)){
            throw new UserNotFoundException("No user with the " + username + " username exists.");
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("No user with the " + username + " username exists."));
        return new UserResponseDTO(user.getUsername(),user.getName(),user.getRole());
    }

    @Override
    public List<UserResponseDTO> getUsersByRole(UserRoles role) {
        List<User> userList = userRepository.findAllByRole(role);
        if(userList.isEmpty()){
            throw new UserNotFoundException("No users with the role: " + role.toString() + ".");
        }
        List<UserResponseDTO> userResponseDTOS=new ArrayList<>();
        for(User u:userList){
            userResponseDTOS.add(
                    new UserResponseDTO(u.getUsername(),u.getName(),u.getRole())
            );
        }
        return userResponseDTOS;
    }

    @Override
    public List<UserResponseDTO> getUsersByName(String name) {
        List<User> userList = userRepository.findAllByName(name);
        if(userList.isEmpty()){
            throw new IllegalArgumentException("No users found");
        }
        List<UserResponseDTO> userResponseDTOS=new ArrayList<>();
        for(User u: userList){
            userResponseDTOS.add(
                    new UserResponseDTO(u.getUsername(),u.getName(),u.getRole())
            );
        }
        return userResponseDTOS;
    }
}
