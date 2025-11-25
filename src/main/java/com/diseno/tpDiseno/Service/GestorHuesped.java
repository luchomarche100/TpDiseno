package com.diseno.tpDiseno.Service;

import java.sql.Date;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.diseno.tpDiseno.Dao.HuespedDAO;
import com.diseno.tpDiseno.Exception.ReglaNegocioException;
import com.diseno.tpDiseno.dto.DireccionDTO;
import com.diseno.tpDiseno.dto.HuespedDTO;
import com.diseno.tpDiseno.dto.request.BuscarHuespedRequest;
import com.diseno.tpDiseno.dto.request.DireccionRequest;
import com.diseno.tpDiseno.dto.request.SolicitudHuespedRequest;
import com.diseno.tpDiseno.dto.response.BuscarHuespedResponse;
import com.diseno.tpDiseno.dto.response.DarAltaResponse;
import com.diseno.tpDiseno.dto.response.ResultadoOperacion;
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
    
    public DarAltaResponse darAltaHuesped(SolicitudHuespedRequest request) {
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
        huesped.setFechaDeNacimiento(request.getFechaDeNacimiento());
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

    public BuscarHuespedResponse buscarHuespedes(BuscarHuespedRequest request) {
    BuscarHuespedResponse response = new BuscarHuespedResponse();

    String tipoDocumentoStr = null;
    if (request.getTipoDocumento() != null && !request.getTipoDocumento().trim().isEmpty()) {
        try {
            TipoDocumentoEnum.valueOf(request.getTipoDocumento().toUpperCase());
            tipoDocumentoStr = request.getTipoDocumento().toUpperCase();
        } catch (IllegalArgumentException e) {
            throw new ReglaNegocioException(
                "TIPO_DOCUMENTO_INVALIDO",
                "El tipo de documento proporcionado no es válido",
                null
            );
        }
    }

    List<Huesped> huespedes = huespedDAO.buscarHuespedes(
        request.getNombre(), 
        request.getApellido(), 
        tipoDocumentoStr,
        request.getNroDocumento()
    );
    
    if (huespedes.isEmpty()) {
        response.setResultadoOperacion(new ResultadoOperacion("No se encontraron huéspedes con los criterios proporcionados"));
    } else {
        List<HuespedDTO> huespedDTOs = new java.util.ArrayList<>();
        for(Huesped h : huespedes) {
            HuespedDTO dto = mapearHuespedADTO(h);
            huespedDTOs.add(dto);
        }
        response.setHuespedes(huespedDTOs);
        response.setResultadoOperacion(new ResultadoOperacion("Se encontraron " + huespedes.size() + " huéspedes"));
    }

    return response;
}

//Mapear un Husped a un HuespedDTO            
    private HuespedDTO mapearHuespedADTO(Huesped h) {
    HuespedDTO dto = new HuespedDTO();
            dto.setId(h.getId());
            dto.setId(h.getId());
            dto.setNombres(h.getNombres());
            dto.setApellido(h.getApellido());
            dto.setTipoDocumento(h.getTipoDocumento());
            dto.setNroDocumento(h.getNroDocumento());
            dto.setCUIT(h.getCUIT());
            dto.setPosIVA(h.getPosIVA());
            dto.setFechaDeNacimiento(h.getFechaDeNacimiento());
            dto.setEmail(h.getEmail());
            dto.setTelefono(h.getTelefono());
            dto.setOcupacion(h.getOcupacion());
            dto.setNacionalidad(h.getNacionalidad());
            //Direccion
            Direccion direccion = h.getDireccion();
            DireccionDTO direccionDTO = new DireccionDTO();
            direccionDTO.setCodigoPostal(direccion.getCodigoPostal());
            direccionDTO.setCalle(direccion.getCalle());
            direccionDTO.setNroCalle(direccion.getNroCalle());
            direccionDTO.setPiso(direccion.getPiso());
            direccionDTO.setNroDepartamento(direccion.getNroDepartamento());
            direccionDTO.setLocalidad(direccion.getLocalidad());
            direccionDTO.setProvincia(direccion.getProvincia());
            direccionDTO.setPais(direccion.getPais());
            dto.setDireccion(direccionDTO);

            return dto;
        }

    public HuespedDTO modificarHuesped(SolicitudHuespedRequest huesped) {
        Huesped huespedExistente = (huespedDAO.findByNroDocumento(huesped.getNroDocumento())).get(0);

            List<ErrorCampo> errores = validadorHuesped.validar(huesped);
        if(!errores.isEmpty()) {
            throw new ReglaNegocioException(
                    "DATOS_OBLIGATORIOS_INCOMPLETOS",
                    "Faltan completar uno o más datos obligatorios",
                    errores
            );
        }


    // Actualizar los campos del huésped existente
        huespedExistente.setNombres(huesped.getNombres());
        huespedExistente.setApellido(huesped.getApellido());
        huespedExistente.setTipoDocumento(TipoDocumentoEnum.valueOf(huesped.getTipoDocumento()));
        huespedExistente.setNroDocumento(huesped.getNroDocumento());
        huespedExistente.setCUIT(huesped.getCUIT());
        huespedExistente.setPosIVA(huesped.getPosIVA());
        huespedExistente.setFechaDeNacimiento(huesped.getFechaDeNacimiento());
        huespedExistente.setEmail(huesped.getEmail());
        huespedExistente.setTelefono(huesped.getTelefono());
        huespedExistente.setOcupacion(huesped.getOcupacion());
        huespedExistente.setNacionalidad(huesped.getNacionalidad());
        // Actualizar la dirección
        Direccion direccionExistente = huespedExistente.getDireccion();
        DireccionRequest direccionDTO = huesped.getDireccion();
        direccionExistente.setCodigoPostal(direccionDTO.getCodigoPostal());
        direccionExistente.setCalle(direccionDTO.getCalle());
        direccionExistente.setNroCalle(direccionDTO.getNroCalle());
        direccionExistente.setPiso(direccionDTO.getPiso());
        direccionExistente.setNroDepartamento(direccionDTO.getNroDepartamento());
        direccionExistente.setLocalidad(direccionDTO.getLocalidad());
        direccionExistente.setProvincia(direccionDTO.getProvincia());
        direccionExistente.setPais(direccionDTO.getPais());
        huespedDAO.save(huespedExistente);
        return mapearHuespedADTO(huespedExistente);
    }
}