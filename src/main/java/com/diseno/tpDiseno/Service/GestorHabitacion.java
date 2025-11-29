package com.diseno.tpDiseno.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List; 

import org.springframework.stereotype.Service;

import com.diseno.tpDiseno.Dao.HabitacionDAO;
import com.diseno.tpDiseno.Exception.ReglaNegocioException;
import com.diseno.tpDiseno.dto.EstadoDiaDTO;
import com.diseno.tpDiseno.dto.HabitacionEstadoDTO;
import com.diseno.tpDiseno.dto.request.MostrarEstadoRequest;
import com.diseno.tpDiseno.dto.response.MostrarEstadoResponse;
import com.diseno.tpDiseno.model.Habitacion;
import com.diseno.tpDiseno.model.Reserva;

import lombok.Data;

@Service
@Data
public class GestorHabitacion {
    private final HabitacionDAO habitacionDao;
    private final Validador validarHabitaciones;
    private final GestorReserva gestorReserva;
    
    public MostrarEstadoResponse mostrarEstado(MostrarEstadoRequest request) {
      
        Boolean esValido = validarHabitaciones.validarFechaDesde(request);
        if (!esValido) {
            throw new ReglaNegocioException(
                "Fecha Desde inválida",
                "La fecha desde proporcionada no es válida",
                null 
            );
        }
        
        esValido = validarHabitaciones.validarFechaHasta(request);
        if (!esValido) {
            throw new ReglaNegocioException(
                "Fecha Hasta inválida",
                "La fecha hasta proporcionada no es válida",
                null      
            );
        }
        
        List<Habitacion> habitaciones = habitacionDao.findAllByOrderByTipoHabitacionAscNumeroAsc();
        List<Reserva> reservas = gestorReserva.obtenerReservaPorFecha(request.getFechaDesde(), request.getFechaHasta());
       
        System.out.println("DEBUG: Total habitaciones encontradas: " + habitaciones.size());
        System.out.println("DEBUG: Total reservas encontradas: " + (reservas != null ? reservas.size() : 0));
       
        MostrarEstadoResponse response = new MostrarEstadoResponse();
        response.setFechaDesde(request.getFechaDesde());
        response.setFechaHasta(request.getFechaHasta());

        List<HabitacionEstadoDTO> habitacionesDTO = new ArrayList<>();
        
        for (Habitacion habitacion : habitaciones) {
            HabitacionEstadoDTO dto = new HabitacionEstadoDTO();
            dto.setNumeroHabitacion(habitacion.getNumero());
            dto.setTipoHabitacion(habitacion.getTipoHabitacion().name());
            dto.setCapacidad(habitacion.getCapacidad());
            dto.setValorPorNoche(habitacion.getValorPorNoche());
            dto.setDescripcion(habitacion.getDescripcion());
            
            // Generar estados por día
            List<EstadoDiaDTO> estadosPorDia = generarEstadosPorDia(
                request.getFechaDesde(), 
                request.getFechaHasta(), 
                habitacion,
                reservas
            );
            dto.setEstadosPorDia(estadosPorDia);
            
            habitacionesDTO.add(dto);
        }
        
        response.setHabitaciones(habitacionesDTO); 
        return response;
    }

    private List<EstadoDiaDTO> generarEstadosPorDia(LocalDate desde, LocalDate hasta, Habitacion habitacion, List<Reserva> reservas) {
        List<EstadoDiaDTO> estados = new ArrayList<>();
        
        LocalDate fechaActual = desde;
        while (!fechaActual.isAfter(hasta)) {
            EstadoDiaDTO estadoDia = new EstadoDiaDTO();
            estadoDia.setFecha(fechaActual);
            
            // Determinar estado según lógica de negocio
            String estado = determinarEstado(habitacion, fechaActual, reservas);
            estadoDia.setEstado(estado);
            
            estados.add(estadoDia);
            fechaActual = fechaActual.plusDays(1);
        }
        
        return estados;
    }
    
    private String determinarEstado(Habitacion habitacion, LocalDate fecha, List<Reserva> reservas) {
        // Verificar si hay una reserva activa para esta habitación en esta fecha
        if (reservas != null && !reservas.isEmpty()) {
            for (Reserva reserva : reservas) {
                // Verificar si esta habitación está en la reserva
                if (reserva.getHabitaciones().contains(habitacion)) {
                    // Verificar si la fecha está dentro del rango de la reserva
                    if (!fecha.isBefore(reserva.getFechaInicio()) && !fecha.isAfter(reserva.getFechaFin())) {
                        // Si el huésped ya hizo check-in, está OCUPADA
                        if (reserva.getCheckedIn() != null && reserva.getCheckedIn()) {
                            return "OCUPADA";
                        }
                        // Si no hizo check-in, está RESERVADA
                        return "RESERVADA";
                    }
                }
            }
        }
        
        // Si no hay reserva activa, retornar el estado base de la habitación
        return habitacion.getEstado().name();
    }
}

