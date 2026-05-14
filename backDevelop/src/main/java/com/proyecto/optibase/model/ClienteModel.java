package com.proyecto.optibase.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "clientes")
@Data
@NoArgsConstructor
public class ClienteModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "Los apellidos son obligatorios")
    private String apellidos;

    // El DNI es único en la tabla y uso la regex oficial española (8 dígitos + letra de control)
    @Pattern(regexp = "^[0-9]{8}[TRWAGMYFPDXBNJZSTQVHLCKE]$", message = "DNI no válido")
    @Column(unique = true, nullable = false)
    private String dni;

    @Pattern(regexp = "^[0-9]{9}$", message = "El teléfono debe tener 9 dígitos")
    private String telefono;

    private String direccion;
    private String edad;
    private String fechaNacimiento;
    private String localidad;
    private String provincia;

    @Pattern(regexp = "^[0-9]{5}$", message = "El código postal debe tener 5 dígitos")
    private String codigoPostal;
}