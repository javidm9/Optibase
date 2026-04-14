package com.proyecto.optibase.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "citas")
@Data
@NoArgsConstructor
public class CitaModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La fecha y hora son obligatorias")
    private LocalDateTime fechaHora;

    @NotBlank(message = "El motivo es obligatorio")
    private String motivo;

    @NotBlank(message = "El estado (Pendiente/Cancelada...) es obligatorio")
    private String estado;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private ClienteModel cliente;
}