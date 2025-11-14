package com.diseno.tpDiseno.dto.request;

import lombok.Data;

@Data
public class DireccionRequest {
    private Integer codigoPostal;
    private String calle;
    private Integer nroCalle;
    private Integer piso;
    private String nroDepartamento;
    private String localidad;
    private String provincia;
    private String pais;
} 