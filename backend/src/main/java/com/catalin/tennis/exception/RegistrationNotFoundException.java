package com.catalin.tennis.exception;

public class RegistrationNotFoundException extends RuntimeException{
    public RegistrationNotFoundException (String message){
        super(message);
    }
}
