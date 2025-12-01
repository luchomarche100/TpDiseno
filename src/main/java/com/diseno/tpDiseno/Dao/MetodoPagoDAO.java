package com.diseno.tpDiseno.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diseno.tpDiseno.model.MetodoPago;

public interface MetodoPagoDAO extends JpaRepository<MetodoPago, Long> {
    // acá podés agregar métodos como:
    // List<MetodoDePago> findByMoneda(TipoMoneda moneda);
}

