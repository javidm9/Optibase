package com.proyecto.optibase.controller;

import com.proyecto.optibase.model.ClienteModel;
import com.proyecto.optibase.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<ClienteModel> obtenerTodos() {
        return clienteService.obtenerClientes();
    }

    @GetMapping("/{id}")
    public Optional<ClienteModel> obtenerPorId(@PathVariable Long id) {
        return clienteService.obtenerPorId(id);
    }

    @GetMapping("/dni/{dni}")
    public Optional<ClienteModel> obtenerPorDni(@PathVariable String dni) {
        return clienteService.obtenerPorDni(dni);
    }

    @PostMapping
    public ClienteModel guardar(@Valid @RequestBody ClienteModel cliente) {
        return clienteService.guardarCliente(cliente);
    }

    @PutMapping("/{id}")
    public ClienteModel actualizar(@PathVariable Long id, @Valid @RequestBody ClienteModel cliente) {
        cliente.setId(id);
        return clienteService.guardarCliente(cliente);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        clienteService.eliminarCliente(id);
    }
}