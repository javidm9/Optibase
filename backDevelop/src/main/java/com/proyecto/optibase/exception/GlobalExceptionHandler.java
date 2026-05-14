package com.proyecto.optibase.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

// Manejador global de excepciones: estandarizo todas las respuestas de error al formato {"error": "..."}
@ControllerAdvice
public class GlobalExceptionHandler {

    // Este handler tiene que ir ANTES del de RuntimeException porque MethodArgumentNotValidException extiende de ella
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException ex) {
        // Devuelvo solo el primer error de validación para no abrumar al cliente con todos a la vez
        String mensaje = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fe -> fe.getDefaultMessage())
                .orElse("Error de validación");
        Map<String, String> error = new HashMap<>();
        error.put("error", mensaje);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Cubro los ResponseStatusException que lanzo desde servicios y controladores (ej. 404, 409)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getReason());
        return new ResponseEntity<>(error, ex.getStatusCode());
    }

    // Captura genérica para cualquier RuntimeException no controlada (como stock insuficiente)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}