package com.catalin.tennis.service.implementations;

import com.catalin.tennis.dto.request.LoginDTO;
import com.catalin.tennis.dto.request.RegisterUserDTO;
import com.catalin.tennis.dto.request.UpdateUserDTO;
import com.catalin.tennis.dto.response.UserResponseDTO;
import com.catalin.tennis.exception.UserNotFoundException;
import com.catalin.tennis.factory.UserFactory;
import com.catalin.tennis.model.User;
import com.catalin.tennis.model.enums.UserRoles;
import com.catalin.tennis.repository.UserRepository;
import com.catalin.tennis.security.JwtUtil;
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
    private final JwtUtil jwtUtil;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, JwtUtil jwtUtil){
        this.userRepository=userRepository;
        this.passwordEncoder=new BCryptPasswordEncoder();
        this.jwtUtil=jwtUtil;
    }
    @Override
    public List<UserResponseDTO> getAllUsers(){
        List<User> users = userRepository.findAll();
        List<UserResponseDTO> dtos=new ArrayList<>();
        for(User u:users){
            dtos.add(
                    new UserResponseDTO(
                            u.getUsername(),
                            u.getName(),
                            u.getRole()
                    )
            );
        }
        return dtos;
    }

    @Override
    public UserResponseDTO updateUser(String username, UpdateUserDTO dto){
        User user=userRepository.findByUsername(username).orElseThrow(
                () -> new UserNotFoundException("User not found with the username: " + username)
        );
        user.setName(dto.getName());

        if(dto.getPassword() != null && !dto.getPassword().isEmpty()){
            String encodedPassword = passwordEncoder.encode(dto.getPassword());
            user.setPasswordHash(encodedPassword);
        }
        userRepository.save(user);
        return new UserResponseDTO(user.getUsername(),user.getName(),user.getRole());
    }

    @Override
    public void deleteUser(String username){
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UserNotFoundException("User not found.")
        );
        userRepository.delete(user);
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
    public String login(LoginDTO loginDTO) {
        User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + loginDTO.getUsername()));

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid password");
        }

        String token = jwtUtil.generateToken(user);
        return token;
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
