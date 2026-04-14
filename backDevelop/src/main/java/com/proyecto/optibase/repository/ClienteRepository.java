package com.proyecto.optibase.repository;

import com.proyecto.optibase.model.ClienteModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<ClienteModel, Long> {
    Optional<ClienteModel> findByDni(String dni);
}