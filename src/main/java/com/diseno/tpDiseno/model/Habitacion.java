package com.diseno.tpDiseno.model;

import java.time.LocalDateTime;

import com.diseno.tpDiseno.util.TipoDeHabitacionEnum;

import jakarta.persistence.Entity;
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

    private TipoDeHabitacionEnum tipoHabitacion;

    private Boolean estado;

    private int capacidad;

    private Float valorPorNoche;
    
    private LocalDateTime horaSalida;

    private String descripcion;

}
