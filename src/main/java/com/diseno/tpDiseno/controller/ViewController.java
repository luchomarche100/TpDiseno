package com.diseno.tpDiseno.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index() {
        // CORRECCIÓN: Devuelve solo el nombre de la plantilla
        return "index"; 
    }
}   