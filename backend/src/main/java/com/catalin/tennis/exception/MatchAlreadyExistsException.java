package com.catalin.tennis.exception;

public class MatchAlreadyExistsException extends RuntimeException{
    public MatchAlreadyExistsException(String message){
        super(message);
    }
}
