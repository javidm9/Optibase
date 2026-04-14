package com.proyecto.optibase.controller;

import com.proyecto.optibase.config.JwtUtil;
import com.proyecto.optibase.dto.LoginRequest;
import com.proyecto.optibase.dto.LoginResponse;
import com.proyecto.optibase.model.UsuarioModel;
import com.proyecto.optibase.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder   passwordEncoder;
    @Autowired private JwtUtil           jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        Optional<UsuarioModel> opt = usuarioRepository.findByNombre(req.nombre());
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UsuarioModel usuario = opt.get();
        if (!passwordEncoder.matches(req.contrasenya(), usuario.getContrasenya())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(new LoginResponse(jwtUtil.generateToken(usuario)));
    }
}
