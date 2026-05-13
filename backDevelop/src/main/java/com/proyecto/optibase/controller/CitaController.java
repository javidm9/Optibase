package com.proyecto.optibase.controller;

import com.proyecto.optibase.model.CitaModel;
import com.proyecto.optibase.service.CitaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    @Autowired
    private CitaService citaService;

    @GetMapping
    public List<CitaModel> obtenerTodas() {
        return citaService.obtenerTodas();
    }

    @GetMapping("/cliente/{clienteId}")
    public List<CitaModel> obtenerPorCliente(@PathVariable Long clienteId) {
        return citaService.obtenerCitasPorCliente(clienteId);
    }

    @PostMapping
    public CitaModel guardar(@Valid @RequestBody CitaModel cita) {
        return citaService.guardarCita(cita);
    }

    @PutMapping("/{id}")
    public CitaModel actualizar(@PathVariable Long id, @Valid @RequestBody CitaModel cita) {
        cita.setId(id);
        return citaService.guardarCita(cita);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        citaService.eliminarCita(id);
    }
}
