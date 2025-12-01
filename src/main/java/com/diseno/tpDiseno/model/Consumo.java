package com.diseno.tpDiseno.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "consumo")
public class Consumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_consumo;

    private String nombre;

    private Float precio;
}

