package com.proyecto.optibase.service;

import com.proyecto.optibase.model.EncargoModel;
import com.proyecto.optibase.repository.EncargoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EncargoService {
    @Autowired
    private EncargoRepository encargoRepository;

    public List<EncargoModel> obtenerTodos() {
        return encargoRepository.findAll();
    }

    public List<EncargoModel> obtenerPorTipo(String tipo) {
        return encargoRepository.findByTipoEncargo(tipo);
    }

    public List<EncargoModel> obtenerPorCliente(Long clienteId) {
        return encargoRepository.findByClienteId(clienteId);
    }

    public EncargoModel guardarEncargo(EncargoModel encargo) {
        return encargoRepository.save(encargo);
    }

    public void eliminarEncargo(Long id) {
        encargoRepository.deleteById(id);
    }
}