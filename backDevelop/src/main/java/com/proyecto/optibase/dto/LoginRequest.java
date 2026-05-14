package com.proyecto.optibase.dto;

// DTO de entrada del login; uso record porque es inmutable y no necesita getters ni equals manuales
public record LoginRequest(String nombre, String contrasenya) {}
