package com.proyecto.optibase.service;

import com.proyecto.optibase.model.HistorialModel;
import com.proyecto.optibase.repository.HistorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

// Servicio del historial de graduaciones: cada entrada pertenece a un cliente y se guarda con su fecha de revisión
@Service
public class HistorialService {
    @Autowired
    private HistorialRepository historialRepository;

    public List<HistorialModel> obtenerHistorialPorCliente(Long clienteId) {
        return historialRepository.findByClienteId(clienteId);
    }

    public HistorialModel guardarHistorial(HistorialModel historial) {
        return historialRepository.save(historial);
    }

    public void eliminarHistorial(Long id) {
        historialRepository.deleteById(id);
    }
}