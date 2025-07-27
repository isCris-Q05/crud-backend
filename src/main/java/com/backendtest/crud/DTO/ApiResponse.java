package com.backendtest.crud.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data // paragenerar getters, setters
public class ApiResponse<T> {
    private int Status;
    private String message;
    //private LocalDateTime timestamp;
    private T data; // generico, puede ser cualquier tipo de dato

    // constructor
    // es usado para crear una respuesta de la API
    public ApiResponse(int status, String message, T data) {
        this.Status = status;
        this.message = message;
        //this.timestamp = timestamp;
        this.data = data;
    }
}
