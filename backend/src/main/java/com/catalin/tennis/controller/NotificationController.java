package com.catalin.tennis.controller;

import com.catalin.tennis.dto.response.NotificationResponseDTO;
import com.catalin.tennis.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService){
        this.notificationService=notificationService;
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<NotificationResponseDTO>> getUserNotifications(@PathVariable String username) {
        return ResponseEntity.ok(notificationService.getUserNotifications(username));
    }

    @PostMapping("/mark-as-read/{id}")
    public ResponseEntity<String> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Notification marked as read");
    }
}
