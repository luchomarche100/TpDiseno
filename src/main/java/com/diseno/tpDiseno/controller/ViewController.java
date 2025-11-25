package com.diseno.tpDiseno.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class ViewController {

    @GetMapping("/")
    public String index() {
        return "index"; 
    }

    @GetMapping("/login")
    public String mostrarLogin() {
        return "login"; 
    }

    @GetMapping("/register")
    public String mostrarRegister() {
        return "register"; 
    }
    @GetMapping("/buscar")
    public String mostrarBuscar() {
        return "buscar";
    }
    
}   