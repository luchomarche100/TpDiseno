package com.diseno.tpDiseno.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class ViewController {



    @GetMapping("/login")
    public String mostrarLogin() {
        return "login";      // login.html
    }

    @GetMapping("/register")
    public String mostrarRegistro() {
        return "register";   // register.html
    }

    @GetMapping("/inicio")
    public String mostrarInicio() {
        return "inicio";     // inicio.html (lo creamos abajo)
    }

    @GetMapping("/huespedes/alta")
    public String mostrarAltaHuesped() {
        return "index";      // index.html = Formulario Alta Huésped
    }

    @GetMapping("/huespedes/buscar")
    public String mostrarBuscarHuesped() {
        return "buscar";     // buscar.html
    }

    @GetMapping("/huespedes/modificar")
    public String mostrarModificarHuesped() {
        return "modificar";  // modificar.html
    }

    @GetMapping("/habitaciones/estado")
    public String mostrarEstadoHabitaciones() {
        return "EstadoHabitacion"; // EstadoHabitacion.html
    }

    @GetMapping("/habitaciones/reservar")
    public String mostrarReservarHabitacion() {
        return "reservar";   // reservar.html
    }

    @GetMapping("/habitaciones/ocupar")
    public String mostrarOcuparHabitacion() {
        return "ocupar";     // ocupar.html (la podrás crear después)
    }
}