package com.diseno.tpDiseno.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diseno.tpDiseno.Service.GestorHuesped;
import com.diseno.tpDiseno.dto.request.BuscarHuespedRequest;
import com.diseno.tpDiseno.dto.request.DarAltaRequest;
import com.diseno.tpDiseno.dto.response.BuscarHuespedResponse;
import com.diseno.tpDiseno.dto.response.DarAltaResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/huespedes")
@CrossOrigin(origins = "*")
public class HuespedController {
    private final GestorHuesped gestorHuesped;
    
    public HuespedController(GestorHuesped gestorHuesped) {
        this.gestorHuesped = gestorHuesped;
    }
    
    @PostMapping
    public ResponseEntity<DarAltaResponse> darAltaHuesped(@RequestBody DarAltaRequest request) {
        DarAltaResponse response = gestorHuesped.darAltaHuesped(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/buscar")
    public ResponseEntity<BuscarHuespedResponse> buscarHuesped(@RequestBody BuscarHuespedRequest huesped) {
        return ResponseEntity.ok(gestorHuesped.buscarHuespedes(huesped));
    }
    
}
