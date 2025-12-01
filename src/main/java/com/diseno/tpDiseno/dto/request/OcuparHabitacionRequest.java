package com.diseno.tpDiseno.dto.request;

import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class OcuparHabitacionRequest {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private List<Long> idsHabitaciones;
    private Long idHuespedTitular;
    private List<Long> idsAcompanantes;
}