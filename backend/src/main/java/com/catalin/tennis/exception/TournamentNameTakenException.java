package com.catalin.tennis.exception;

public class TournamentNameTakenException extends RuntimeException{
    public TournamentNameTakenException(String message){
        super(message);
    }
}
