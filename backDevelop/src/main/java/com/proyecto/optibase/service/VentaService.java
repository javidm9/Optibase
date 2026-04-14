package com.proyecto.optibase.service;

import com.proyecto.optibase.model.VentaModel;
import com.proyecto.optibase.model.ProductoModel;
import com.proyecto.optibase.repository.VentaRepository;
import com.proyecto.optibase.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VentaService {
    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional
    public VentaModel guardarVenta(VentaModel venta) {
        ProductoModel producto = productoRepository.findById(venta.getProducto().getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (producto.getStock() <= 0) {
            throw new RuntimeException("No hay stock suficiente para este producto");
        }

        producto.setStock(producto.getStock() - 1);
        productoRepository.save(producto);

        return ventaRepository.save(venta);
    }

    public List<VentaModel> obtenerVentasPorCliente(Long clienteId) {
        return ventaRepository.findByClienteId(clienteId);
    }

    public List<VentaModel> obtenerPendientesDePago() {
        return ventaRepository.findByPagadoFalse();
    }

    public void eliminarVenta(Long id) {
        ventaRepository.deleteById(id);
    }
}