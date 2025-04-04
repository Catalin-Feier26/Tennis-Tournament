package com.catalin.tennis.exception;

public class MatchNotFoundException extends RuntimeException{
    public MatchNotFoundException(String message){
        super(message);
    }
}
