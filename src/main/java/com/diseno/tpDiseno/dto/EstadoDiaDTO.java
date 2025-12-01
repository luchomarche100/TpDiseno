package com.diseno.tpDiseno.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class EstadoDiaDTO {
    private LocalDate fecha;
    private String estado; // "DISPONIBLE", "OCUPADA", "RESERVADA", "MANTENIMIENTO"
    
    // Información de la reserva (solo cuando estado = RESERVADA u OCUPADA)
    private String reservaNombre;
    private String reservaApellido;
    private String reservaTelefono;
}