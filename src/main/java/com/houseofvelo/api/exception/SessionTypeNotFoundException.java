package com.houseofvelo.api.exception;

public class SessionTypeNotFoundException extends RuntimeException {
    public SessionTypeNotFoundException(String message) {
        super(message);
    }
}
