package com.diseno.tpDiseno.Service;

import java.sql.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.diseno.tpDiseno.Dao.HuespedDAO;
import com.diseno.tpDiseno.Exception.ReglaNegocioException;
import com.diseno.tpDiseno.dto.request.DarAltaRequest;
import com.diseno.tpDiseno.dto.request.DireccionRequest;
import com.diseno.tpDiseno.dto.response.DarAltaResponse;
import com.diseno.tpDiseno.model.Direccion;
import com.diseno.tpDiseno.model.Huesped;
import com.diseno.tpDiseno.util.ErrorCampo;
import com.diseno.tpDiseno.util.TipoDocumentoEnum;

import lombok.Data;

@Service
@Data
public class GestorHuesped {
    private final HuespedDAO huespedDAO;
    private final Validador validadorHuesped;
    
    public DarAltaResponse darAltaHuesped(DarAltaRequest request) {
        DarAltaResponse response = new DarAltaResponse();
        
        List<ErrorCampo> errores = validadorHuesped.validar(request);
        if(!errores.isEmpty()) {
            throw new ReglaNegocioException(
                    "DATOS_OBLIGATORIOS_INCOMPLETOS",
                    "Faltan completar uno o más datos obligatorios",
                    errores
            );
        }

        TipoDocumentoEnum tipoDoc = TipoDocumentoEnum.valueOf(request.getTipoDocumento());
        Huesped huespedExistente = huespedDAO
                .findFirstByTipoDocumentoAndNroDocumento(tipoDoc, request.getNroDocumento());
        boolean existeHuesped = huespedExistente != null;
        boolean forzar=false;
        if (request.getTipoYDniRepetido() != null && request.getTipoYDniRepetido()) {
            forzar = true;
        }

        // Si ya existe y NO se fuerza, lanzar excepción DOCUMENTO_DUPLICADO
        if (existeHuesped && !forzar) {
            throw new ReglaNegocioException(
                    "DOCUMENTO_DUPLICADO",
                    "El tipo y número de documento ya existen en el sistema",
                    null
            );
        }
    
        // Camino feliz: crear el huésped
        Huesped huesped = new Huesped();
        
        // Mapear datos básicos
        huesped.setNombres(request.getNombres());
        huesped.setApellido(request.getApellido());
        huesped.setTipoDocumento(TipoDocumentoEnum.valueOf(request.getTipoDocumento()));
        huesped.setNroDocumento(request.getNroDocumento());
        huesped.setCUIT(request.getCUIT());
        huesped.setPosIVA(request.getPosIVA());
        huesped.setFechaDeNacimiento(Date.valueOf(request.getFechaDeNacimiento()));
        huesped.setEmail(request.getEmail());
        huesped.setTelefono(request.getTelefono());
        huesped.setOcupacion(request.getOcupacion());
        huesped.setNacionalidad(request.getNacionalidad());
        
        // Mapear dirección de DTO a Entidad
        Direccion direccion = mapearDireccion(request.getDireccion());
        huesped.setDireccion(direccion);
        
        Huesped huespedGuardado = huespedDAO.save(huesped);//Aca se creo y se guardo el huesped en la BD
        
        //Por ahora esta es la respuesta. vemos si la cambiamos
        response.setIdHuesped(huespedGuardado.getId());
        response.setNombres(huespedGuardado.getNombres());
        response.setApellido(huespedGuardado.getApellido());
        response.setMensaje("Huésped dado de alta exitosamente");

        return response;
        //fin de logica CU:09 Dar de alta Huesped
    }

//Funciones auxiliares
    //Esto sirve para obtener la entidad Direccion a partir del request
    private Direccion mapearDireccion(DireccionRequest direccionRequest) {
        Direccion direccion = new Direccion();
        direccion.setCodigoPostal(direccionRequest.getCodigoPostal());
        direccion.setCalle(direccionRequest.getCalle());
        direccion.setNroCalle(direccionRequest.getNroCalle());
        direccion.setPiso(direccionRequest.getPiso());
        direccion.setNroDepartamento(direccionRequest.getNroDepartamento());
        direccion.setLocalidad(direccionRequest.getLocalidad());
        direccion.setProvincia(direccionRequest.getProvincia());
        direccion.setPais(direccionRequest.getPais());
        return direccion;
    }
    

} 