package com.catalin.tennis;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.catalin.tennis.dto.request.*;
import com.catalin.tennis.dto.response.UserResponseDTO;
import com.catalin.tennis.exception.InvalidPasswordException;
import com.catalin.tennis.model.User;
import com.catalin.tennis.model.enums.UserRoles;
import com.catalin.tennis.repository.UserRepository;
import com.catalin.tennis.security.JwtUtil;
import com.catalin.tennis.service.implementations.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserServiceImpl userService;

    @Captor
    ArgumentCaptor<User> userCaptor;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllUsers_success() {
        User user = new User();
        user.setUsername("john");
        user.setName("John Doe");
        user.setRole(UserRoles.TENNIS_PLAYER);

        when(userRepository.findAll()).thenReturn(List.of(user));

        List<UserResponseDTO> result = userService.getAllUsers();
        assertEquals(1, result.size());
    }

    @Test
    void updateUser_success() {
        User user = new User();
        user.setUsername("john");
        user.setName("John");
        user.setPasswordHash(new BCryptPasswordEncoder().encode("oldpass"));
        user.setRole(UserRoles.TENNIS_PLAYER);

        UpdateUserDTO dto = new UpdateUserDTO("John Updated", "oldpass", "newpass", "TENNIS_PLAYER");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));

        userService.updateUser("john", dto);

        verify(userRepository).save(userCaptor.capture());
        assertEquals("John Updated", userCaptor.getValue().getName());
    }

    @Test
    void updateUser_invalidOldPassword_throwsException() {
        User user = new User();
        user.setUsername("john");
        user.setPasswordHash(new BCryptPasswordEncoder().encode("correct"));

        UpdateUserDTO dto = new UpdateUserDTO("John Updated", "wrong", "newpass", "TENNIS_PLAYER");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));

        assertThrows(InvalidPasswordException.class, () -> userService.updateUser("john", dto));
    }

    @Test
    void deleteUser_success() {
        User user = new User();
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));

        userService.deleteUser("john");

        verify(userRepository).delete(user);
    }

    @Test
    void register_success() {
        RegisterUserDTO dto = new RegisterUserDTO("john", "pass", "John");

        when(userRepository.existsUserByUsername("john")).thenReturn(false);
        when(userRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        UserResponseDTO result = userService.register(dto);
        assertEquals("john", result.getUsername());
    }

    @Test
    void login_success() {
        User user = new User();
        user.setUsername("john");
        user.setPasswordHash(new BCryptPasswordEncoder().encode("pass"));
        user.setRole(UserRoles.TENNIS_PLAYER);

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(user)).thenReturn("mock-token");

        Map<String, String> response = userService.login(new LoginDTO("john", "pass"));
        assertEquals("mock-token", response.get("token"));
    }

    @Test
    void login_invalidPassword_throwsException() {
        User user = new User();
        user.setUsername("john");
        user.setPasswordHash(new BCryptPasswordEncoder().encode("correct"));

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));

        assertThrows(InvalidPasswordException.class, () ->
                userService.login(new LoginDTO("john", "wrong")));
    }

    @Test
    void createUser_success() {
        CreateUserDTO dto = new CreateUserDTO("john", "pass", "John", UserRoles.TENNIS_PLAYER);

        when(userRepository.existsUserByUsername("john")).thenReturn(false);
        when(userRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        UserResponseDTO result = userService.createUser(dto);
        assertEquals("john", result.getUsername());
    }

    @Test
    void getUserByUsername_success() {
        User user = new User();
        user.setUsername("john");
        user.setName("John");
        user.setRole(UserRoles.TENNIS_PLAYER);

        when(userRepository.existsUserByUsername("john")).thenReturn(true);
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));

        UserResponseDTO result = userService.getUserByUsername("john");
        assertEquals("john", result.getUsername());
    }

    @Test
    void getUsersByRole_success() {
        User user = new User();
        user.setRole(UserRoles.TENNIS_PLAYER);

        when(userRepository.findAllByRole(UserRoles.TENNIS_PLAYER)).thenReturn(List.of(user));

        List<UserResponseDTO> result = userService.getUsersByRole(UserRoles.TENNIS_PLAYER);
        assertFalse(result.isEmpty());
    }

    @Test
    void getPlayersByName_success() {
        User user = new User();
        user.setUsername("john");

        when(userRepository.findAllByRoleAndNameContainingIgnoreCase(eq(UserRoles.TENNIS_PLAYER), anyString()))
                .thenReturn(List.of(user));

        List<UserResponseDTO> result = userService.getPlayersByName("john");
        assertFalse(result.isEmpty());
    }

    @Test
    void getPlayersByRegistrationPeriod_success() {
        User user = new User();
        user.setUsername("john");

        when(userRepository.findAllByRoleAndCreatedAtBetween(eq(UserRoles.TENNIS_PLAYER), any(), any()))
                .thenReturn(List.of(user));

        List<UserResponseDTO> result = userService.getPlayersByRegistrationPeriod(LocalDateTime.now().minusDays(1), LocalDateTime.now());
        assertFalse(result.isEmpty());
    }
}
