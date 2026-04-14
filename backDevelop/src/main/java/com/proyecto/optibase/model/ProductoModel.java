package com.proyecto.optibase.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
public class ProductoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;

    private String tipo;

    @Positive(message = "El precio debe ser mayor a 0")
    private Double precio;

    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    private boolean esRecambio = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_padre_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ProductoModel productoPadre;
}