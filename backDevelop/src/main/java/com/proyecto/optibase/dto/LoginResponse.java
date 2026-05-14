package com.proyecto.optibase.dto;

// DTO de respuesta del login: devuelve token JWT, rol y nombre para que el front pueda mostrarlos sin decodificar el token
public record LoginResponse(String token, String rol, String nombre) {}
