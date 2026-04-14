package com.proyecto.optibase.config;

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
