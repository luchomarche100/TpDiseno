package com.diseno.tpDiseno.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diseno.tpDiseno.Service.GestorHabitacion;
import com.diseno.tpDiseno.dto.request.MostrarEstadoRequest;
import com.diseno.tpDiseno.dto.request.OcuparHabitacionRequest;
import com.diseno.tpDiseno.dto.request.ReservarHabitacionRequest;
import com.diseno.tpDiseno.dto.response.MostrarEstadoResponse;
import com.diseno.tpDiseno.dto.response.OcuparHabitacionResponse;
import com.diseno.tpDiseno.dto.response.ReservaHuespedResponse;

@RestController
@RequestMapping("/api/habitaciones")
//@CrossOrigin(origins = "*")
public class HabitacionController {
    private final GestorHabitacion gestorHabitacion;
    
    public HabitacionController(GestorHabitacion gestorHabitacion) {
        this.gestorHabitacion = gestorHabitacion;
    }
//Caso de uso 05 mostrar estado de habitacion
    @PostMapping("/estado")
    public ResponseEntity<MostrarEstadoResponse> mostrarEstado(@RequestBody MostrarEstadoRequest request) {
        MostrarEstadoResponse response= gestorHabitacion.mostrarEstado(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reservar")
    public ResponseEntity<ReservaHuespedResponse> reservarHabitacion(@RequestBody ReservarHabitacionRequest request) {
        ReservaHuespedResponse response= gestorHabitacion.reservarHabitacion(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/ocupar")
    public ResponseEntity<OcuparHabitacionResponse> ocuparHabitacion(@RequestBody OcuparHabitacionRequest request) {
        OcuparHabitacionResponse response = gestorHabitacion.ocuparHabitacion(request);
        return ResponseEntity.ok(response);
    }

}
