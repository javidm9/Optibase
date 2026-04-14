package com.proyecto.optibase.repository;

import com.proyecto.optibase.model.HistorialModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistorialRepository extends JpaRepository<HistorialModel, Long> {
    List<HistorialModel> findByClienteId(Long ClienteId);
}