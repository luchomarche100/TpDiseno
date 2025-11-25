package com.diseno.tpDiseno.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diseno.tpDiseno.dto.request.LoginRequest;
import com.diseno.tpDiseno.util.ErrorCampo; 
import com.diseno.tpDiseno.Service.LoginService;
import com.diseno.tpDiseno.Service.Validador;
import com.diseno.tpDiseno.model.Usuario;


@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired 
    private Validador validador;
    
    @Autowired 
    private LoginService loginService; 

    @PostMapping("/login") 
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        
        // --- 1. APLICAR VALIDACIÓN MANUAL (Verificar campos vacíos) ---
        List<ErrorCampo> errores = validador.validarLogin(loginRequest);

        if (!errores.isEmpty()) {
            // Devolver 400 Bad Request si hay errores de validación de campos
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
        }

        // --- 2. LÓGICA DE AUTENTICACIÓN (Regla de negocio) ---
        
        if (loginService.autenticar(loginRequest)) {
            
            // Si es válido, devolvemos 200 OK
            return ResponseEntity.ok("Login exitoso.");
            
        } else {
            // Si las credenciales no coinciden, devolvemos 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales invalidas"); 
        }
    }

    @PostMapping("/register")
        public ResponseEntity<?> registrar(@RequestBody LoginRequest loginRequest) {
        try {
            // Llama al servicio para registrar y verifica la unicidad
            Usuario nuevoUsuario = loginService.registrarNuevoUsuario(loginRequest);
            
            // Si tiene éxito, devuelve 201 Created
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
            
        } catch (IllegalArgumentException e) {
            // Captura la excepción de unicidad del servicio y devuelve 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // Manejo de otros errores
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fallo al registrar el usuario.");
        }
    }
} 
    

