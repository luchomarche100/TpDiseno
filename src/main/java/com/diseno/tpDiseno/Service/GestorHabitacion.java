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
import com.diseno.tpDiseno.dto.request.OcuparHabitacionRequest;
import com.diseno.tpDiseno.dto.request.ReservarHabitacionRequest;
import com.diseno.tpDiseno.dto.response.MostrarEstadoResponse;
import com.diseno.tpDiseno.dto.response.OcuparHabitacionResponse;
import com.diseno.tpDiseno.dto.response.ReservaHuespedResponse;
import com.diseno.tpDiseno.model.Habitacion;
import com.diseno.tpDiseno.model.Huesped;
import com.diseno.tpDiseno.model.Reserva;
import com.diseno.tpDiseno.util.ErrorCampo;

import lombok.Data;

@Service
@Data
public class GestorHabitacion {
    private final HabitacionDAO habitacionDao;
    private final Validador validarHabitaciones;
    private final GestorReserva gestorReserva;
    private final GestorHuesped gestorHuesped;




    public ReservaHuespedResponse reservarHabitacion(ReservarHabitacionRequest request) {
       validarHabitaciones.validarReserva(request);
        LocalDate fechaInicio =request.getFechaInicio(); 
        LocalDate fechaFin = request.getFechaFin();
        List<Habitacion> habitaciones = habitacionDao.findAllById(request.getHabitacionesIds());
        if(habitaciones.size() != request.getHabitacionesIds().size()) {
           List<ErrorCampo> errores = List.of(
                new ErrorCampo()
            );
            throw new ReglaNegocioException(
                "HABITACION_INEXISTENTE",
                "Se seleccionaron habitaciones inexistentes",
                errores
            );
        }
        List<Reserva> reservasExistentes = gestorReserva.obtenerReservaPorFecha(fechaInicio, fechaFin);
        validarHabitaciones.validarDisponibilidad(habitaciones, reservasExistentes);

        Reserva reserva = gestorReserva.crearReserva(
            fechaInicio, 
            fechaFin, 
            habitaciones,
            request.getApellido(),
            request.getNombre(),
            request.getTelefono()
        );
        
        ReservaHuespedResponse response = new ReservaHuespedResponse();
        response.setIdReserva(reserva.getId());
        response.setMensaje("Reserva creada exitosamente");
        response.setApellido(reserva.getApellido());
        response.setNombre(reserva.getNombre());
        response.setTelefono(reserva.getTelefono());
        response.setHabitacionesIds(request.getHabitacionesIds());
        response.setFechaInicio(fechaInicio);
        response.setFechaFin(fechaFin);
        
        return response;
    }



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
       
        /* estas lineas son para debuguear, ya que tuve un problema:/
        System.out.println("DEBUG: Total habitaciones encontradas: " + habitaciones.size());
        System.out.println("DEBUG: Total reservas encontradas: " + (reservas != null ? reservas.size() : 0));*/
       
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
            
            // Determinar estado y obtener info de reserva si existe
            determinarEstadoConInfo(habitacion, fechaActual, reservas, estadoDia);
            
            estados.add(estadoDia);
            fechaActual = fechaActual.plusDays(1);
        }
        
        return estados;
    }
    
    private void determinarEstadoConInfo(Habitacion habitacion, LocalDate fecha, List<Reserva> reservas, EstadoDiaDTO estadoDia) {
        // Verificar si hay una reserva activa para esta habitación en esta fecha
        if (reservas != null && !reservas.isEmpty()) {
            for (Reserva reserva : reservas) {
                // Verificar si esta habitación está en la reserva
                if (reserva.getHabitaciones().contains(habitacion)) {
                    // se ve si la fecha cae dentro del rango de la reserva
                    if (!fecha.isBefore(reserva.getFechaInicio()) && !fecha.isAfter(reserva.getFechaFin())) {
                        // aca vemos si esta ocupada o reservada
                        if (reserva.getCheckedIn() != null && reserva.getCheckedIn()) {
                            estadoDia.setEstado("OCUPADA");
                        } else {
                            estadoDia.setEstado("RESERVADA");
                        }
                        
                        // Agregar información de la reserva
                        estadoDia.setReservaNombre(reserva.getNombre());
                        estadoDia.setReservaApellido(reserva.getApellido());
                        estadoDia.setReservaTelefono(reserva.getTelefono());
                        return;
                    }
                }
            }
        }
        
        // Si no hay reserva activa, retornar el estado base de la habitación
        estadoDia.setEstado(habitacion.getEstado().name());
    }


    public OcuparHabitacionResponse ocuparHabitacion(OcuparHabitacionRequest request) {
        // Validar el request
        validarHabitaciones.validarOcuparHabitacion(request);
        
        // Obtener el huésped titular y acompañantes
        Huesped titular = gestorHuesped.obtenerHuespedPorId(request.getIdHuespedTitular());
        List<Huesped> acompanantes = gestorHuesped.obtenerHuespedesPorIds(request.getIdsAcompanantes());
        
        // Obtener las habitaciones solicitadas
        List<Habitacion> habitaciones = habitacionDao.findAllById(request.getIdsHabitaciones());
        if (habitaciones.size() != request.getIdsHabitaciones().size()) {
            List<ErrorCampo> errores = List.of(
                new ErrorCampo()
            );
            throw new ReglaNegocioException(
                "HABITACION_INEXISTENTE",
                "Se seleccionaron habitaciones inexistentes",
                errores
            );
        }
        
        // Buscar si existe una reserva para estas fechas y habitaciones
        // Si no existe, crear una nueva
        Reserva reserva = null;
        for (Long idHabitacion : request.getIdsHabitaciones()) {
            reserva = gestorReserva.obtenerReservaPorFechaYHabitacion(
                request.getFechaInicio(), 
                request.getFechaFin(), 
                idHabitacion
            );
            if (reserva != null) {
                break;
            }
        }
        
        // Si no existe reserva, crear una nueva
        if (reserva == null) {
            reserva = new Reserva();
            reserva.setFechaInicio(request.getFechaInicio());
            reserva.setFechaFin(request.getFechaFin());
            reserva.setHabitaciones(habitaciones);
            reserva.setApellido(titular.getApellido());
            reserva.setNombre(titular.getNombres());
            reserva.setTelefono(titular.getTelefono());
        }
        
        // Marcar la reserva como ocupada (check-in realizado)
        reserva.setCheckedIn(true);
        reserva.setHuespedTitular(titular);
        reserva.setAcompanantes(acompanantes);
        
        // Marcar al titular como responsable de esta reserva
        titular.setResponsable(true);
        gestorHuesped.guardarHuesped(titular);
        
        // Guardar la reserva
        gestorReserva.guardarReserva(reserva);

        // El estado de las habitaciones se determina dinámicamente en la vista
        // No se actualiza el estado base de la habitación

        // Construir la respuesta
        OcuparHabitacionResponse response = new OcuparHabitacionResponse();
        response.setMensaje("Habitación ocupada exitosamente");
        response.setIdReserva(reserva.getId());
        response.setIdHuespedTitular(titular.getId());
        response.setNombreTitular(titular.getNombres());
        response.setApellidoTitular(titular.getApellido());
        response.setIdsAcompanantes(request.getIdsAcompanantes());
        response.setIdsHabitaciones(request.getIdsHabitaciones());
        response.setFechaInicio(request.getFechaInicio());
        response.setFechaFin(request.getFechaFin());
        
        return response;
    }
}

