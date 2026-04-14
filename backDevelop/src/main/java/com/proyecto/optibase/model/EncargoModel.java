package com.proyecto.optibase.model;

import jakarta.persistence.*;
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

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private ClienteModel cliente;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private ProductoModel producto;

    @Column(nullable = false)
    private LocalDateTime fechaEncargo;

    private LocalDateTime fechaEntregaPrevista;

    @Column(nullable = false)
    private String tipoEncargo;

    private String proveedor;

    private String numeroPedidoFabrica;

    @Column(nullable = false)
    private String estado;

    @Column(length = 1000)
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private UsuarioModel tecnicoAsignado;
}