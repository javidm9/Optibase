package com.proyecto.optibase.controller;

import com.proyecto.optibase.model.ProductoModel;
import com.proyecto.optibase.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public List<ProductoModel> obtenerPrincipales() {
        return productoService.obtenerProductosPrincipales();
    }

    @GetMapping("/{id}/recambios")
    public List<ProductoModel> obtenerRecambios(@PathVariable Long id) {
        return productoService.obtenerRecambiosDe(id);
    }

    @PostMapping
    public ProductoModel guardar(@Valid @RequestBody ProductoModel producto) {
        return productoService.guardarProducto(producto);
    }

    @PutMapping("/{id}")
    public ProductoModel actualizar(@PathVariable Long id, @Valid @RequestBody ProductoModel producto) {
        producto.setId(id);
        return productoService.guardarProducto(producto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        productoService.eliminarProducto(id);
    }
}