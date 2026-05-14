package com.proyecto.optibase.controller;

import com.proyecto.optibase.model.HistorialModel;
import com.proyecto.optibase.service.HistorialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controlador del historial de graduaciones: las entradas están siempre ligadas a un cliente,
// por eso el único GET es por clienteId y no hay un "listar todos"
@RestController
@RequestMapping("/api/historiales")
public class HistorialController {

    @Autowired
    private HistorialService historialService;

    @GetMapping("/cliente/{clienteId}")
    public List<HistorialModel> obtenerPorCliente(@PathVariable Long clienteId) {
        return historialService.obtenerHistorialPorCliente(clienteId);
    }

    @PostMapping
    public HistorialModel guardar(@Valid @RequestBody HistorialModel historial) {
        return historialService.guardarHistorial(historial);
    }

    @PutMapping("/{id}")
    public HistorialModel actualizar(@PathVariable Long id, @Valid @RequestBody HistorialModel historial) {
        historial.setId(id);
        return historialService.guardarHistorial(historial);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        historialService.eliminarHistorial(id);
    }
}
