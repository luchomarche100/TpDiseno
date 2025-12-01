package com.diseno.tpDiseno.model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "pago_efectivo")
public class Efectivo extends MetodoPago {

    private Float vuelto;
}
    