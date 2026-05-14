package com.proyecto.optibase.controller;

import com.proyecto.optibase.model.VentaModel;
import com.proyecto.optibase.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// Controlador de ventas: el POST delega en VentaService.guardarVenta() que también descuenta el stock del producto
@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @GetMapping
    public List<VentaModel> obtenerTodas() {
        return ventaService.obtenerTodas();
    }

    @GetMapping("/cliente/{clienteId}")
    public List<VentaModel> obtenerPorCliente(@PathVariable Long clienteId) {
        return ventaService.obtenerVentasPorCliente(clienteId);
    }

    // Este endpoint lo usa el módulo de estadísticas para mostrar el listado de deudas pendientes
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