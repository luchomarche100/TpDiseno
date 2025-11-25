package com.diseno.tpDiseno.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diseno.tpDiseno.model.Habitacion;

public interface HabitacionDAO extends JpaRepository<Habitacion, Long> {
    
    // Método para obtener todas las habitaciones ordenadas por tipo y número
    List<Habitacion> findAllByOrderByTipoHabitacionAscNumeroAsc();
    
}