package com.catalin.tennis.exception;

public class RegistrationAlreadyExistsException extends RuntimeException{
    public RegistrationAlreadyExistsException(String message){
        super(message);
    }
}
