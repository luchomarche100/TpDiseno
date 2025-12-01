package com.diseno.tpDiseno.model;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "pago_cheque")
public class Cheque extends MetodoPago {

    private String numero;

    @Temporal(TemporalType.DATE)
    private Date fechaCobro;

    private String plaza;

    private String banco;
}
