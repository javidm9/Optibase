package com.proyecto.optibase.config;

// Objeto auxiliar para transportar los datos del usuario autenticado sin depender de la entidad JPA
public class UserPrincipal {
    private final String nombre;
    private final String rol;
    private final Long clienteId;

    public UserPrincipal(String nombre, String rol, Long clienteId) {
        this.nombre = nombre;
        this.rol = rol;
        this.clienteId = clienteId;
    }

    public String getNombre()    { return nombre; }
    public String getRol()       { return rol; }
    public Long   getClienteId() { return clienteId; }
}
