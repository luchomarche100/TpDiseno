package com.diseno.tpDiseno.model;

import java.sql.Date;

import com.diseno.tpDiseno.util.TipoDocumentoEnum;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Huesped {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
//Todos lo que tienen @Column(nullable = false) son obligatorios.
    @Column(nullable = false)
    private String nombres;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false)
    private String nroDocumento;

    @Column(nullable = false)
    private String posIVA;

    @Column(nullable = false)
    private Date fechaDeNacimiento;
 
    @Column(nullable = false)
    private String telefono;

    @Column(nullable = false)
    private String ocupacion;

    @OneToOne(cascade = CascadeType.ALL)
       private Direccion direccion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoDocumentoEnum tipoDocumento;

    @Column(nullable = false)
    private String nacionalidad;
//Estos no son obligatorios
    private String CUIT;
    private String email;

}
