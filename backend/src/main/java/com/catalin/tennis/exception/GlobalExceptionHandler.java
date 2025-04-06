package com.catalin.tennis.exception;

import com.catalin.tennis.dto.response.RegistrationStatusDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("message", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<Map<String,String>> handleInvalidPassword(InvalidPasswordException ex){
        Map<String,String> body = new HashMap<>();
        body.put("message", ex.getMessage());
        return new ResponseEntity<>(body,HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<String> handleUsernameTaken(UsernameAlreadyExistsException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(TournamentNotFoundException.class)
    public ResponseEntity<String> handleTournamentNotFound(TournamentNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(RegistrationAlreadyExistsException.class)
    public ResponseEntity<?> handleRegistrationAlreadyExists(RegistrationAlreadyExistsException ex) {
        RegistrationStatusDTO status = new RegistrationStatusDTO("You are already registered for this tournament");
        return new ResponseEntity<>(status, HttpStatus.OK);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex) {
        return new ResponseEntity<>("Internal error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
