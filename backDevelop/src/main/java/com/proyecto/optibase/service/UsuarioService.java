package com.proyecto.optibase.service;

import com.proyecto.optibase.model.UsuarioModel;
import com.proyecto.optibase.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UsuarioModel> obtenerUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<UsuarioModel> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public UsuarioModel guardarUsuario(UsuarioModel usuario) {
        // Si ya llega hasheado (edición sin cambio de contraseña) no vuelvo a hashear para no corromperlo
        String pass = usuario.getContrasenya();
        if (pass != null && !pass.startsWith("$2a$") && !pass.startsWith("$2b$")) {
            usuario.setContrasenya(passwordEncoder.encode(pass));
        }
        return usuarioRepository.save(usuario);
    }

    // Devuelvo boolean para que el controlador pueda responder 204 o 404 según si existía el usuario
    public boolean eliminarUsuario(Long id) {
        try {
            usuarioRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
