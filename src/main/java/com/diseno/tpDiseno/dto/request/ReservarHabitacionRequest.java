package com.diseno.tpDiseno.dto.request;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;
@Data
public class ReservarHabitacionRequest {
    private List<Long> habitacionesIds;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Long huespedId; // Opcional: si el huésped ya está registrado
    private String apellido;
    private String nombre;
    private String telefono;
}
