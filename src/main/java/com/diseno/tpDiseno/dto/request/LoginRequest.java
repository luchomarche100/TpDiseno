package com.diseno.tpDiseno.dto.request;



public class LoginRequest {

    // Los nombres de las variables deben coincidir con las claves del JSON que envia JS (ej: { "username": "...", "password": "..." })
    

    private String username;


    private String password;

    // --- Constructor vacío es necesario para Spring ---
    public LoginRequest() {
    }

    // --- Getters y Setters ---
    
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}