package com.diseno.tpDiseno.model;

import java.time.LocalTime;


import com.diseno.tpDiseno.util.EstadoHabitacionEnum;
import com.diseno.tpDiseno.util.TipoDeHabitacionEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Habitacion {

    @Id
    private Long numero;

    @Enumerated(EnumType.STRING) 
    @Column(nullable = false)
    private TipoDeHabitacionEnum tipoHabitacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoHabitacionEnum estado;

    private int capacidad;

    private Float valorPorNoche;

    private String descripcion;

    private LocalTime horaSalida;

}
