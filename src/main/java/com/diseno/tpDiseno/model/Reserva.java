package com.diseno.tpDiseno.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    
    @Column(nullable = false)
    private Boolean checkedIn = false; // true = huésped hizo check-in (OCUPADA), false = solo reserva (RESERVADA)

    @ManyToMany
    private List<Habitacion> habitaciones;
    
    // Datos del eventual huésped (para reservas sin check-in)
    @Column(nullable = false)
    private String apellido;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false)
    private String telefono;
    
    // Relaciones con huéspedes (para ocupaciones con check-in)
    @ManyToOne
    private Huesped huespedTitular;
    
    @ManyToMany
    private List<Huesped> acompanantes;
}
