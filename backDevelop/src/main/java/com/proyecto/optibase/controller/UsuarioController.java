package com.proyecto.optibase.controller;

import com.proyecto.optibase.model.UsuarioModel;
import com.proyecto.optibase.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<UsuarioModel> obtenerTodos() {
        return usuarioService.obtenerUsuarios();
    }

    @GetMapping("/{id}")
    public UsuarioModel obtenerPorId(@PathVariable Long id) {
        return usuarioService.obtenerPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    @PostMapping
    public UsuarioModel guardar(@Valid @RequestBody UsuarioModel usuario) {
        return usuarioService.guardarUsuario(usuario);
    }

    @PutMapping("/{id}")
    public UsuarioModel actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioModel usuario) {
        usuario.setId(id);
        return usuarioService.guardarUsuario(usuario);
    }

    // Devuelvo 204 si se borró o 404 si el ID no existía, en vez de siempre 200
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> eliminar(@PathVariable Long id) {
        boolean eliminado = usuarioService.eliminarUsuario(id);
        return eliminado
                ? org.springframework.http.ResponseEntity.noContent().build()
                : org.springframework.http.ResponseEntity.notFound().build();
    }
}