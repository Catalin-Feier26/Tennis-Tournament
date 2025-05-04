package com.catalin.tennis;

import com.catalin.tennis.dto.response.NotificationResponseDTO;
import com.catalin.tennis.exception.UserNotFoundException;
import com.catalin.tennis.model.Notification;
import com.catalin.tennis.model.User;
import com.catalin.tennis.repository.NotificationRepository;
import com.catalin.tennis.repository.UserRepository;
import com.catalin.tennis.service.implementations.NotificationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getUserNotifications_returnsList() {
        Notification n1 = new Notification();
        n1.setId(1L);
        n1.setMessage("Welcome!");
        n1.setTimestamp(LocalDateTime.now());
        n1.setRead(false);

        List<Notification> notifications = List.of(n1);

        when(notificationRepository.findByUserUsernameOrderByTimestampDesc("john"))
                .thenReturn(notifications);

        List<NotificationResponseDTO> result = notificationService.getUserNotifications("john");

        assertEquals(1, result.size());
        assertEquals("Welcome!", result.get(0).getMessage());
    }

    @Test
    void createNotification_success() {
        User user = new User();
        user.setUsername("john");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(notificationRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        assertDoesNotThrow(() -> notificationService.createNotification("john", "Test message"));
    }

    @Test
    void createNotification_userNotFound_throwsException() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
                () -> notificationService.createNotification("ghost", "Message"));
    }

    @Test
    void markAsRead_success() {
        Notification notification = new Notification();
        notification.setId(5L);
        notification.setRead(false);

        when(notificationRepository.findById(5L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any())).thenReturn(notification);

        assertDoesNotThrow(() -> notificationService.markAsRead(5L));
        assertTrue(notification.isRead());
    }

    @Test
    void markAsRead_notFound_throwsException() {
        when(notificationRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> notificationService.markAsRead(999L));
    }
}
