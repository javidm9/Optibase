package com.proyecto.optibase.service;

import com.proyecto.optibase.model.CitaModel;
import com.proyecto.optibase.repository.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CitaService {
    @Autowired
    private CitaRepository citaRepository;

    public List<CitaModel> obtenerCitasPorCliente(Long clienteId) {
        return citaRepository.findByClienteId(clienteId);
    }

    public List<CitaModel> obtenerTodas() {
        return citaRepository.findAll();
    }

    public CitaModel guardarCita(CitaModel cita) {
        boolean hayConflicto = (cita.getId() == null)
                ? citaRepository.existsByFechaHora(cita.getFechaHora())
                : citaRepository.existsByFechaHoraAndIdNot(cita.getFechaHora(), cita.getId());

        if (hayConflicto) {
            throw new RuntimeException("Error: Ya existe una cita programada para esa fecha/hora");
        }
        return citaRepository.save(cita);
    }

    public void eliminarCita(Long id) {
        citaRepository.deleteById(id);
    }
}