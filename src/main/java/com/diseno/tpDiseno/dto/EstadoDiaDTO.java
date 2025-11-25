package com.diseno.tpDiseno.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class EstadoDiaDTO {
    private LocalDate fecha;
    private String estado; // "DISPONIBLE", "OCUPADA", "RESERVADA", "MANTENIMIENTO"
    }