package com.diseno.tpDiseno.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Direccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer codigoPostal;
    @Column(nullable = false)
    private String calle;//
    @Column(nullable = false)
    private Integer nroCalle; ////
    @Column(nullable = false)
    private Integer piso;
    @Column(nullable = false)
    private String nroDepartamento;
    @Column(nullable = false)
    private String localidad;
    @Column(nullable = false)
    private String provincia;
    @Column(nullable = false)
    private String pais;
}
