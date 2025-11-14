package com.diseno.tpDiseno.dto.response;

import java.util.List;

import com.diseno.tpDiseno.util.ErrorCampo;

import lombok.Data;

@Data
public class ErrorCampoResponse {
    private String codigo;
    private String mensaje;
    private List<ErrorCampo> errores;
}
 