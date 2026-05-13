package com.proyecto.optibase.controller;

import com.proyecto.optibase.model.UsuarioModel;
import com.proyecto.optibase.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

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
    public Optional<UsuarioModel> obtenerPorId(@PathVariable Long id) {
        return usuarioService.obtenerPorId(id);
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

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
    }
}