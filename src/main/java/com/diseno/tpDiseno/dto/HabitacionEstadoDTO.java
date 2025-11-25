package com.diseno.tpDiseno.dto;

import java.util.List;

import lombok.Data;

@Data
public class HabitacionEstadoDTO {
    private Long numeroHabitacion;
    private String tipoHabitacion;
    private Integer capacidad;
    private Float valorPorNoche;
    private String descripcion;
    private List<EstadoDiaDTO> estadosPorDia;
}
