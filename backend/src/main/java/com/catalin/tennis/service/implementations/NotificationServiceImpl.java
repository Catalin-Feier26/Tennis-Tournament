package com.catalin.tennis.service.implementations;

import com.catalin.tennis.dto.response.NotificationResponseDTO;
import com.catalin.tennis.exception.UserNotFoundException;
import com.catalin.tennis.model.Notification;
import com.catalin.tennis.model.User;
import com.catalin.tennis.repository.NotificationRepository;
import com.catalin.tennis.repository.UserRepository;
import com.catalin.tennis.service.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {


    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository){
        this.notificationRepository=notificationRepository;
        this.userRepository=userRepository;
    }

    @Override
    public List<NotificationResponseDTO> getUserNotifications(String username) {
        return notificationRepository.findByUserUsernameOrderByTimestampDesc(username)
                .stream()
                .map(n -> new NotificationResponseDTO(n.getId(), n.getMessage(), n.getTimestamp(), n.isRead()))
                .collect(Collectors.toList());
    }

    @Override
    public void createNotification(String username, String message) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
