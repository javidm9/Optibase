package com.proyecto.optibase.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
@Data
@NoArgsConstructor
public class VentaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private ClienteModel cliente;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private ProductoModel producto;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioModel vendedor;

    @Column(nullable = false)
    private LocalDateTime fechaVenta;

    @Column(nullable = false)
    private Double importe;

    @Column(nullable = false)
    private String metodoPago;

    private boolean pagado;
}