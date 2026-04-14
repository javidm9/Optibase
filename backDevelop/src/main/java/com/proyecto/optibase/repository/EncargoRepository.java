package com.proyecto.optibase.repository;

import com.proyecto.optibase.model.EncargoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EncargoRepository extends JpaRepository<EncargoModel, Long> {
    List<EncargoModel> findByTipoEncargo(String tipo);
    List<EncargoModel> findByClienteId(Long clienteId);
}