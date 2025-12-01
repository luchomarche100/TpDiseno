package com.diseno.tpDiseno.model;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "facturas")
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_factura;

    @Column(nullable = false, unique = true)
    private String numero;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date fechaConfeccion;

    @Column(nullable = false)
    private Float importeNeto;

    @Column(nullable = false)
    private Float importeTotal;

    @Column(nullable = false)
    private Float IVA;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Pago> pagos;

    @OneToMany(cascade = CascadeType.ALL)
    private List<NotaDeCredito> notaDeCreditos;
}
