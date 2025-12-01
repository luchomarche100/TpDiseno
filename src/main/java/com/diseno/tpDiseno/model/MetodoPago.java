package com.diseno.tpDiseno.model;

import com.diseno.tpDiseno.util.TipoMoneda;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "metodo_pago")
public abstract class MetodoPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float importe;

    @Enumerated(EnumType.STRING)
    private TipoMoneda moneda;

    private String cotizacion;
}
