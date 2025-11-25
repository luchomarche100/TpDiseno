package com.diseno.tpDiseno.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diseno.tpDiseno.model.Usuario;

import java.util.Optional;

public interface UsuarioDAO extends JpaRepository<Usuario, Long> {
    
    // MÉTODOS NECESARIOS PARA EL LOGIN:

    Optional<Usuario> findByUsername(String username);
    
}