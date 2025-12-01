package com.diseno.tpDiseno.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "nota_credito")
public class NotaDeCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroNotaCredito;
}
