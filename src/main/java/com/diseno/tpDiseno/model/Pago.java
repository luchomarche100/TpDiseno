package com.diseno.tpDiseno.model;

import com.diseno.tpDiseno.util.TipoMoneda;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_pago;

    @Column(nullable = false)
    private Float importe;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMoneda moneda;

    private String cotizacion;

    @OneToOne (cascade = CascadeType.ALL)
    private MetodoPago metodoPago;
}
