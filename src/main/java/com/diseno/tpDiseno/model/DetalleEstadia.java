package com.diseno.tpDiseno.model;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Time;
import java.util.List;

@Data
@Entity
@Table(name = "detalle_estadia")
public class DetalleEstadia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_detalleEstadia;

    private Time horaSalida;

    private Float valor;

    @ManyToMany
    @JoinTable(
            name = "detalle_estadia_consumo",
            joinColumns = @JoinColumn(name = "detalleEstadia_id"),
            inverseJoinColumns = @JoinColumn(name = "consumo_id")
    )
    private List<Consumo> consumos;
}

