package com.diseno.tpDiseno.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diseno.tpDiseno.model.Habitacion;

public interface HabitacionDAO extends JpaRepository<Habitacion, Long> {
    
}