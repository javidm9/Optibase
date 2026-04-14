package com.proyecto.optibase.controller;

import com.proyecto.optibase.model.VentaModel;
import com.proyecto.optibase.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:4200")
public class VentaController {

    @Autowired
    private VentaService ventaService;
    
    @GetMapping("/cliente/{clienteId}")
    public List<VentaModel> obtenerPorCliente(@PathVariable Long clienteId) {
        return ventaService.obtenerVentasPorCliente(clienteId);
    }

    @GetMapping("/pendientes")
    public List<VentaModel> obtenerPendientes() {
        return ventaService.obtenerPendientesDePago();
    }

    @PostMapping
    public VentaModel guardar(@Valid @RequestBody VentaModel venta) {
        return ventaService.guardarVenta(venta);
    }

    @PutMapping("/{id}")
    public VentaModel actualizar(@PathVariable Long id, @Valid @RequestBody VentaModel venta) {
        venta.setId(id);
        return ventaService.guardarVenta(venta);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        ventaService.eliminarVenta(id);
    }
}