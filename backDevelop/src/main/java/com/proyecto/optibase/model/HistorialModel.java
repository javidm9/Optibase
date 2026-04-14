package com.proyecto.optibase.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "historiales")
@Data
@NoArgsConstructor
public class HistorialModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fechaRevision;

    private Double odEsfera;
    private Double odCilindro;
    private Integer odEje;
    private Double odAdicion;
    private Double avOd;

    private Double oiEsfera;
    private Double oiCilindro;
    private Integer oiEje;
    private Double oiAdicion;
    private Double avOi;

    private Double dip;

    @Column(length = 1000)
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private ClienteModel cliente;
}