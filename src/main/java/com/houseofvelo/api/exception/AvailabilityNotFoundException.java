package com.houseofvelo.api.exception;

public class AvailabilityNotFoundException extends RuntimeException{
    public AvailabilityNotFoundException(String message){
        super(message);
    }
}
