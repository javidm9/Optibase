package com.proyecto.optibase.service;

import com.proyecto.optibase.model.ClienteModel;
import com.proyecto.optibase.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Servicio de clientes: delega directamente en el repositorio porque la lógica de negocio de cliente es sencilla
@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

    public List<ClienteModel> obtenerClientes() {
        return clienteRepository.findAll();
    }

    public Optional<ClienteModel> obtenerPorId(Long id) {
        return clienteRepository.findById(id);
    }

    public Optional<ClienteModel> obtenerPorDni(String dni) {
        return clienteRepository.findByDni(dni);
    }

    public ClienteModel guardarCliente(ClienteModel cliente) {
        return clienteRepository.save(cliente);
    }

    public void eliminarCliente(Long id) {
        clienteRepository.deleteById(id);
    }
}
