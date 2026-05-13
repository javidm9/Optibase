package com.proyecto.optibase.controller;

import com.proyecto.optibase.model.EncargoModel;
import com.proyecto.optibase.service.EncargoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/encargos")
public class EncargoController {

    @Autowired
    private EncargoService encargoService;

    @GetMapping("/tipo/{tipo}")
    public List<EncargoModel> obtenerPorTipo(@PathVariable String tipo) {
        return encargoService.obtenerPorTipo(tipo);
    }

    @GetMapping("/cliente/{clienteId}")
    public List<EncargoModel> obtenerPorCliente(@PathVariable Long clienteId) {
        return encargoService.obtenerPorCliente(clienteId);
    }

    @PostMapping
    public EncargoModel guardar(@Valid @RequestBody EncargoModel encargo) {
        return encargoService.guardarEncargo(encargo);
    }

    @PutMapping("/{id}")
    public EncargoModel actualizar(@PathVariable Long id, @Valid @RequestBody EncargoModel encargo) {
        encargo.setId(id);
        return encargoService.guardarEncargo(encargo);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        encargoService.eliminarEncargo(id);
    }
}