package com.diseno.tpDiseno.dto.request;

import java.time.LocalDate;

import lombok.Data;

@Data
public class SolicitudHuespedRequest {

    private String nombres;
    private String apellido;
    private String nroDocumento;
    private String CUIT;
    private String posIVA;
    private LocalDate fechaDeNacimiento;
    private String email;
    private String telefono;
    private String ocupacion;
    private DireccionRequest direccion;
    private String tipoDocumento;
    private String nacionalidad;
    private Boolean tipoYDniRepetido; 
/*La idea del tipoYDniRepetido es que cuando se cargue al huesped, el front mande este campo en false,
y si existe un huesped con ese tipo y ese dni, el back le mande al front lo sucedido y
 si el usuario pone seguir igualmente, 
 el front le manda al back el mismo request pero con este campo en true, 
para que el back sepa que debe seguir igualmente con la creacion del huesped aun sabiendo que ya existe uno con ese tipo y dni*/
    
}
 