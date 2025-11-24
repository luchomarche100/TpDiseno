package com.diseno.tpDiseno.dto.request;
import lombok.Data;


@Data
public class BuscarHuespedRequest {
    private String nombre;
    private String apellido;
    private String nroDocumento;
    private String tipoDocumento;
}
