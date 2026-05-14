package com.proyecto.optibase.repository;

import com.proyecto.optibase.model.ProductoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<ProductoModel, Long> {
    // Separo el listado principal de los recambios para no mezclarlos en la tabla de inventario
    List<ProductoModel> findByEsRecambioFalse();
    List<ProductoModel> findByProductoPadreId(Long padreId);
}