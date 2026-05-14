package com.proyecto.optibase.repository;

import com.proyecto.optibase.model.VentaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<VentaModel, Long> {
    List<VentaModel> findByClienteId(Long clienteId);
    // findByPagadoFalse lo usa el endpoint /pendientes para mostrar las ventas sin cobrar
    List<VentaModel> findByPagadoFalse();
}