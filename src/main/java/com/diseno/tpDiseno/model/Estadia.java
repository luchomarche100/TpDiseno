package com.diseno.tpDiseno.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "estadia")
public class Estadia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_estadia;

    @Temporal(TemporalType.DATE)
    private Date fechaInicio;

    @Temporal(TemporalType.DATE)
    private Date fechaFinal;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Factura> facturas;

    @OneToMany(cascade = CascadeType.ALL)
    private List<DetalleEstadia> detallesEstadia;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Huesped> huespedes;
}
