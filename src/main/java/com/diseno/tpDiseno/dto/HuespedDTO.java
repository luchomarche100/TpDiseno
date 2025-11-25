package com.diseno.tpDiseno.dto;

import java.sql.Date;

import com.diseno.tpDiseno.util.TipoDocumentoEnum;

import lombok.Data;

    @Data

public class HuespedDTO {

    private Long id;
    private String nombres;
    private String apellido;
    private String nroDocumento;
    private String posIVA;
    private Date fechaDeNacimiento; 
    private String telefono;
    private String ocupacion;
    private DireccionDTO direccion;
    private TipoDocumentoEnum tipoDocumento;
    private String nacionalidad;
    private String CUIT;
    private String email;
}
