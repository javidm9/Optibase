package com.proyecto.optibase.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "encargos")
@Data
@NoArgsConstructor
public class EncargoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El cliente es obligatorio")
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private ClienteModel cliente;

    // El producto es opcional: un encargo puede ser de lentes sin montura asociada en el catálogo
    @ManyToOne
    @JoinColumn(name = "producto_id")
    private ProductoModel producto;

    @NotNull(message = "La fecha del encargo es obligatoria")
    @Column(nullable = false)
    private LocalDateTime fechaEncargo;

    private LocalDateTime fechaEntregaPrevista;

    @NotBlank(message = "El tipo de encargo es obligatorio")
    @Column(nullable = false)
    private String tipoEncargo;

    private String proveedor;

    private String numeroPedidoFabrica;

    @NotBlank(message = "El estado es obligatorio")
    @Column(nullable = false)
    private String estado;

    @Column(length = 1000)
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private UsuarioModel tecnicoAsignado;
}