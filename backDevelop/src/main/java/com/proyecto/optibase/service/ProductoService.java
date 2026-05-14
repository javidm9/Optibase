package com.proyecto.optibase.service;

import com.proyecto.optibase.model.ProductoModel;
import com.proyecto.optibase.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    // Solo devuelvo productos principales en el listado general; los recambios se consultan por separado para no saturar la tabla
    public List<ProductoModel> obtenerProductosPrincipales() {
        return productoRepository.findByEsRecambioFalse();
    }

    public List<ProductoModel> obtenerRecambiosDe(Long padreId) {
        return productoRepository.findByProductoPadreId(padreId);
    }

    public ProductoModel guardarProducto(ProductoModel producto) {
        return productoRepository.save(producto);
    }

    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }
}