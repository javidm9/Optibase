package com.proyecto.optibase.service;

import com.proyecto.optibase.model.CitaModel;
import com.proyecto.optibase.repository.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        // Al editar una cita existente excluyo su propio ID para que no se marque como conflicto consigo misma
        boolean hayConflicto = (cita.getId() == null)
                ? citaRepository.existsByFechaHora(cita.getFechaHora())
                : citaRepository.existsByFechaHoraAndIdNot(cita.getFechaHora(), cita.getId());

        if (hayConflicto) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cita programada para esa fecha/hora");
        }
        return citaRepository.save(cita);
    }

    public void eliminarCita(Long id) {
        citaRepository.deleteById(id);
    }
}