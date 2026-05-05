package com.proyecto.optibase.service;

import com.proyecto.optibase.model.ClienteModel;
import com.proyecto.optibase.repository.ClienteRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    // ----------------------------------------------------------------
    // TC-CLI-01: obtenerClientes devuelve lista no vacía
    // ----------------------------------------------------------------
    @Test
    @DisplayName("TC-CLI-01: obtenerClientes devuelve la lista del repositorio")
    void tcCli01_obtenerClientes_devuelveLista() {
        ClienteModel c = new ClienteModel();
        c.setNombre("Ana");
        when(clienteRepository.findAll()).thenReturn(List.of(c));

        List<ClienteModel> resultado = clienteService.obtenerClientes();

        assertFalse(resultado.isEmpty(), "La lista no debe estar vacía");
        assertEquals(1, resultado.size());
        verify(clienteRepository, times(1)).findAll();
    }

    // ----------------------------------------------------------------
    // TC-CLI-02: obtenerPorId con ID existente devuelve Optional con cliente
    // ----------------------------------------------------------------
    @Test
    @DisplayName("TC-CLI-02: obtenerPorId con ID existente devuelve el cliente")
    void tcCli02_obtenerPorId_existente_devuelveCliente() {
        ClienteModel c = new ClienteModel();
        c.setNombre("Pedro");
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(c));

        Optional<ClienteModel> resultado = clienteService.obtenerPorId(1L);

        assertTrue(resultado.isPresent(), "Debe devolver un Optional con valor");
        assertEquals("Pedro", resultado.get().getNombre());
        verify(clienteRepository, times(1)).findById(1L);
    }

    // ----------------------------------------------------------------
    // TC-CLI-03: obtenerPorId con ID inexistente → orElseThrow lanza RuntimeException
    // ----------------------------------------------------------------
    @Test
    @DisplayName("TC-CLI-03: obtenerPorId con ID inexistente lanza RuntimeException al desempaquetar")
    void tcCli03_obtenerPorId_inexistente_lanzaRuntimeException() {
        when(clienteRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                clienteService.obtenerPorId(99L)
                        .orElseThrow(() -> new RuntimeException("Cliente no encontrado"))
        );
        verify(clienteRepository, times(1)).findById(99L);
    }

    // ----------------------------------------------------------------
    // TC-CLI-04: guardarCliente persiste y devuelve el cliente
    // ----------------------------------------------------------------
    @Test
    @DisplayName("TC-CLI-04: guardarCliente llama a save y devuelve el cliente guardado")
    void tcCli04_guardarCliente_persisteYDevuelve() {
        ClienteModel c = new ClienteModel();
        c.setNombre("Laura");
        when(clienteRepository.save(c)).thenReturn(c);

        ClienteModel resultado = clienteService.guardarCliente(c);

        assertNotNull(resultado, "El resultado no debe ser null");
        assertEquals("Laura", resultado.getNombre());
        verify(clienteRepository, times(1)).save(c);
    }

    // ----------------------------------------------------------------
    // TC-CLI-05: eliminarCliente delega en deleteById del repositorio
    // ----------------------------------------------------------------
    @Test
    @DisplayName("TC-CLI-05: eliminarCliente llama a deleteById del repositorio")
    void tcCli05_eliminarCliente_llamaDeleteById() {
        doNothing().when(clienteRepository).deleteById(1L);

        clienteService.eliminarCliente(1L);

        verify(clienteRepository, times(1)).deleteById(1L);
    }
}
