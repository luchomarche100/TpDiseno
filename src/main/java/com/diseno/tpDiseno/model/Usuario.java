package com.diseno.tpDiseno.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table; // Es buena práctica especificar el nombre de la tabla
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// La tabla se llamará 'usuario' en la base de datos
@Entity
@Table(name = "usuario") 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre de usuario único (el que se usa para iniciar sesión)
    @Column(nullable = false, unique = true)
    private String username; 
    
    // Contraseña (DEBERÍA GUARDARSE CIFRADA EN PRODUCCIÓN, pero para el TP es String)
    @Column(nullable = false)
    private String password; 
    
    // Opcional: Para definir roles o perfiles de acceso (ej: ADMIN, RECEPCION)
    @Column(nullable = false)
    private String rol; 

    // Opcional: Relacionar la cuenta de login con la entidad Huesped (si el usuario es un huésped)
    // @OneToOne
    // private Huesped huesped; 
} 
