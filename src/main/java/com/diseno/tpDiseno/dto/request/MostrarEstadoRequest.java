package com.diseno.tpDiseno.dto.request;

import java.time.LocalDate;

import lombok.Data;

@Data
public class MostrarEstadoRequest {
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
}
