package com.diseno.tpDiseno.dto;

import java.sql.Date;

import com.diseno.tpDiseno.model.Direccion;
import com.diseno.tpDiseno.util.TipoDocumentoEnum;
import com.diseno.tpDiseno.util.PosicionFrenteIVAEnum;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Data;


    @Data

public class HuespedDTO {

    private Long id;
    private String nombres;
    private String apellido;
    private String nroDocumento;
    private PosicionFrenteIVAEnum posIVA;
    private Date fechaDeNacimiento; 
    private String telefono;
    private String ocupacion;
    private DireccionDTO direccion;
    private TipoDocumentoEnum tipoDocumento;
    private String nacionalidad;
    private String CUIT;
    private String email;
}
