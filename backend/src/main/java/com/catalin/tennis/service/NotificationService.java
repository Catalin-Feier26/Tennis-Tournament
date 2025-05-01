package com.catalin.tennis.service;

import com.catalin.tennis.dto.response.NotificationResponseDTO;

import java.util.List;

public interface NotificationService {
    List<NotificationResponseDTO> getUserNotifications(String username);
    void createNotification(String username, String message);
    void markAsRead(Long notificationId);
}
