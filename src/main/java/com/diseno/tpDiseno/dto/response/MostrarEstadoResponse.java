package com.diseno.tpDiseno.dto.response;

import java.time.LocalDate;
import java.util.List;

import com.diseno.tpDiseno.dto.HabitacionEstadoDTO;

import lombok.Data;

@Data
public class MostrarEstadoResponse {
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
    private List<HabitacionEstadoDTO> habitaciones;
 
}
