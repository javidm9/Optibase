package com.proyecto.optibase.repository;

import com.proyecto.optibase.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {
    // El login busca por nombre de usuario (no por ID) así que necesito este método derivado
    Optional<UsuarioModel> findByNombre(String nombre);
}