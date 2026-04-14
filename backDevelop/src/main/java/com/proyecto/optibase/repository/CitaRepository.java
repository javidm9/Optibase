package com.proyecto.optibase.repository;

import com.proyecto.optibase.model.CitaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<CitaModel, Long> {
    List<CitaModel> findByClienteId(Long clienteId);

    boolean existsByFechaHora(LocalDateTime fechaHora);

    boolean existsByFechaHoraAndIdNot(LocalDateTime fechaHora, Long id);
}