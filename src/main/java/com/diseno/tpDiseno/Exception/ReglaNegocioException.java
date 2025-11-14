package com.diseno.tpDiseno.Exception;

import java.util.List;

import com.diseno.tpDiseno.util.ErrorCampo;

public class ReglaNegocioException extends RuntimeException {
    
    private final String codigo;  // ej: "DATOS_OBLIGATORIOS_INCOMPLETOS"
    private final List<ErrorCampo> errores;

    public ReglaNegocioException(String codigo, String mensaje, List<ErrorCampo> errores) {
        super(mensaje);
        this.codigo = codigo;
        this.errores = errores;
    }

    public String getCodigo() {
        return codigo;
    }

    public List<ErrorCampo> getErrores() {
        return errores;
    }
    
} 
