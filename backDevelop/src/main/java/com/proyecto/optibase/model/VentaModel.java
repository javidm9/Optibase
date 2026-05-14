package com.proyecto.optibase.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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

    @NotNull(message = "El cliente es obligatorio")
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private ClienteModel cliente;

    @NotNull(message = "El producto es obligatorio")
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private ProductoModel producto;

    @NotNull(message = "El vendedor es obligatorio")
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioModel vendedor;

    @NotNull(message = "La fecha de venta es obligatoria")
    @Column(nullable = false)
    private LocalDateTime fechaVenta;

    @NotNull(message = "El importe es obligatorio")
    @Positive(message = "El importe debe ser mayor a 0")
    @Column(nullable = false)
    private Double importe;

    @NotBlank(message = "El método de pago es obligatorio")
    @Column(nullable = false)
    private String metodoPago;

    private boolean pagado;
}