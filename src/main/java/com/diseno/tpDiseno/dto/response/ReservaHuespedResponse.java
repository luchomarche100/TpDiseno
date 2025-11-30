package com.diseno.tpDiseno.dto.response;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaHuespedResponse {
    private Long idReserva;
    private String mensaje;
    private String apellido;
    private String nombre;
    private String telefono;
    private List<Long> habitacionesIds;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
