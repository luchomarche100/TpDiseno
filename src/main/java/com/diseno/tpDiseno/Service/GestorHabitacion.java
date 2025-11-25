package com.diseno.tpDiseno.Service;

import org.springframework.stereotype.Service;

import com.diseno.tpDiseno.Dao.HabitacionDAO;
import com.diseno.tpDiseno.Exception.ReglaNegocioException;
import com.diseno.tpDiseno.dto.request.MostrarEstadoRequest;
import com.diseno.tpDiseno.dto.response.MostrarEstadoResponse;

import lombok.Data;

@Service
@Data
public class GestorHabitacion {
    private final HabitacionDAO habitacionDao;
    private final Validador validarHabitaciones;
    public MostrarEstadoResponse mostrarEstado(MostrarEstadoRequest request) {
        MostrarEstadoResponse response = new MostrarEstadoResponse();
        Boolean esValido= validarHabitaciones.validarFechaDesde(request);
        if (!esValido) {
            // Manejar el caso de fecha no válida, lanzar excepción o retornar error
           throw new ReglaNegocioException(
                    "Fecha Desde inválida",
                    "La fecha desde proporcionada no es válida",
                    null 
            );
        }
        esValido= validarHabitaciones.validarFechaHasta(request);
        if (!esValido) {
             throw new ReglaNegocioException(
                    "Fecha Hasta inválida",
                    "La fecha hasta proporcionada no es válida",
                    null      
            );
        }

        return response;
    }
}
