package com.diseno.tpDiseno.model;
import com.diseno.tpDiseno.util.TipoTarjeta;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "pago_tarjeta")
public class Tarjeta extends MetodoPago {

    @Enumerated(EnumType.STRING)
    private TipoTarjeta tipo;

    private String numero;

    private String banco;
}
