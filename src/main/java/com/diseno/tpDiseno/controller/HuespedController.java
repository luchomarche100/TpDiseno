package com.diseno.tpDiseno.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diseno.tpDiseno.Service.GestorHuesped;
import com.diseno.tpDiseno.dto.request.DarAltaRequest;
import com.diseno.tpDiseno.dto.response.DarAltaResponse;

@RestController
@RequestMapping("/huesped")
public class HuespedController {
    private final GestorHuesped gestorHuesped;
    
    public HuespedController(GestorHuesped gestorHuesped) {
        this.gestorHuesped = gestorHuesped;
    }
    
    @PostMapping("/darAlta")
    public ResponseEntity<DarAltaResponse> darAltaHuesped(@RequestBody DarAltaRequest request) {
        DarAltaResponse response = gestorHuesped.darAltaHuesped(request);
        return ResponseEntity.ok(response);
    }
}
    