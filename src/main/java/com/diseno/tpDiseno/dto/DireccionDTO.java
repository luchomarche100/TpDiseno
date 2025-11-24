package com.diseno.tpDiseno.dto;

import jakarta.persistence.Column;
import lombok.Data;
@Data
public class DireccionDTO {
    private Integer codigoPostal;
    private String calle;
    private Integer nroCalle; 
    private Integer piso;
    private String nroDepartamento;
    private String localidad;
    private String provincia;
    private String pais;
}
