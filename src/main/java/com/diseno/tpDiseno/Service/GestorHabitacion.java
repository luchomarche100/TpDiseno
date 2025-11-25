package com.diseno.tpDiseno.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

import lombok.Data;

@Service
@Data
public class GestorHabitacion {
    private final HabitacionDAO habitacionDao;
    private final Validador validarHabitaciones;
    
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
                habitacion
            );
            dto.setEstadosPorDia(estadosPorDia);
            
            habitacionesDTO.add(dto);
        }
        
        response.setHabitaciones(habitacionesDTO); 
        return response;
    }

    private List<EstadoDiaDTO> generarEstadosPorDia(LocalDate desde, LocalDate hasta, Habitacion habitacion) {
        List<EstadoDiaDTO> estados = new ArrayList<>();
        
        LocalDate fechaActual = desde;
        while (!fechaActual.isAfter(hasta)) {
            EstadoDiaDTO estadoDia = new EstadoDiaDTO();
            estadoDia.setFecha(fechaActual);
            
            // Determinar estado según lógica de negocio
            String estado = determinarEstado(habitacion, fechaActual);
            estadoDia.setEstado(estado);
            
            estados.add(estadoDia);
            fechaActual = fechaActual.plusDays(1);
        }
        
        return estados;
    }
    
    private String determinarEstado(Habitacion habitacion, LocalDate fecha) {
        // Si horaSalida tiene valor, la habitación está OCUPADA hasta esa fecha
        if (habitacion.getHoraSalida() != null) {
            LocalDate fechaSalida = habitacion.getHoraSalida().toLocalDate();
            if (!fecha.isAfter(fechaSalida)) {
                return "OCUPADA";
            }
        }
        
        // Si estado es false (y no está ocupada), está en MANTENIMIENTO
        if (!habitacion.getEstado()) {
            return "MANTENIMIENTO";
        }
        
        // TODO: Consultar tabla Reserva para verificar si está RESERVADA en esta fecha
        // Por ahora, si no está ocupada ni en mantenimiento, está disponible
        
        return "DISPONIBLE";
    }
}

