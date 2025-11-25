package com.diseno.tpDiseno.model;

import java.sql.Date;
import java.time.LocalDate;

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

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String nombres;

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String apellido;

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String nroDocumento;

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String posIVA;

    @Column(nullable = false)
    private LocalDate fechaDeNacimiento;
 
    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String telefono;

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String ocupacion;

    @OneToOne(cascade = CascadeType.ALL)
    private Direccion direccion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoDocumentoEnum tipoDocumento;

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String nacionalidad;

    @Column(columnDefinition = "VARCHAR(255)")
    private String CUIT;
    
    @Column(columnDefinition = "VARCHAR(255)")
    private String email;
}
