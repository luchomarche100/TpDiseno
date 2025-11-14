package com.diseno.tpDiseno.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.diseno.tpDiseno.Exception.ReglaNegocioException;
import com.diseno.tpDiseno.dto.response.ErrorCampoResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ErrorCampoResponse> manejarReglaNegocio(ReglaNegocioException ex) {

        ErrorCampoResponse response = new ErrorCampoResponse();
        response.setCodigo(ex.getCodigo());
        response.setMensaje(ex.getMessage());
        response.setErrores(ex.getErrores());

        // 400 porque es un error del request, no del servidor
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
