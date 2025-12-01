package com.diseno.tpDiseno.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diseno.tpDiseno.model.Habitacion;

public interface FacturaDAO extends JpaRepository<Habitacion, Long> {

    
} 