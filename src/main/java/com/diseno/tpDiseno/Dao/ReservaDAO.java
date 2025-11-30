package com.diseno.tpDiseno.Dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.diseno.tpDiseno.model.Reserva;

public interface ReservaDAO extends JpaRepository<Reserva, Long> {

    @Query("SELECT DISTINCT r FROM Reserva r LEFT JOIN FETCH r.habitaciones WHERE r.fechaInicio <= :fechaFin AND r.fechaFin >= :fechaInicio")
    List<Reserva> findAllByFechaBetween(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
    
}
