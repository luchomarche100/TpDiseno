package com.diseno.tpDiseno.dto.response;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class OcuparHabitacionResponse {
    private String mensaje;
    private Long idReserva;
    private Long idHuespedTitular;
    private String nombreTitular;
    private String apellidoTitular;
    private List<Long> idsAcompanantes;
    private List<Long> idsHabitaciones;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
