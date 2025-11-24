package com.diseno.tpDiseno.dto.response;

import lombok.Data;

@Data
public class ResultadoOperacion {
    private String codigo;
    private String mensaje;

    public ResultadoOperacion(String mensaje) {
        this.mensaje = mensaje;
    }


}
    

