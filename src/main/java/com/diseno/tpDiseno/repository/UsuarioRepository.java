package com.diseno.tpDiseno.repository;

import com.diseno.tpDiseno.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // MÉTODOS NECESARIOS PARA EL LOGIN:

    Optional<Usuario> findByUsername(String username);
    
}