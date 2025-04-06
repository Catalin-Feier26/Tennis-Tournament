package com.catalin.tennis.controller;

import com.catalin.tennis.dto.request.CreateUserDTO;
import com.catalin.tennis.dto.request.UpdateUserDTO;
import com.catalin.tennis.dto.response.UserResponseDTO;
import com.catalin.tennis.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService=userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers(){
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username){
        UserResponseDTO user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{username}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable String username, @Valid @RequestBody UpdateUserDTO updateUserDTO){
        UserResponseDTO updatedUser = userService.updateUser(username, updateUserDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<String> deleteUser(@PathVariable String username){
        userService.deleteUser(username);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody CreateUserDTO createUserDTO) {
        UserResponseDTO newUser = userService.createUser(createUserDTO);
        return ResponseEntity.ok(newUser);
    }

}
