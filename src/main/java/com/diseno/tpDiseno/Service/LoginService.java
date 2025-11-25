package com.diseno.tpDiseno.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diseno.tpDiseno.dto.request.LoginRequest;
import com.diseno.tpDiseno.repository.UsuarioRepository; 
import com.diseno.tpDiseno.model.Usuario; 
import java.util.Optional;

@Service 
public class LoginService {
    
    // Inyecta el repositorio para buscar usuarios en la base de datos
    @Autowired
    private UsuarioRepository usuarioRepository; 

   
    public boolean autenticar(LoginRequest request) {
        
        // 1. Buscar el usuario en la DB
        Optional<Usuario> optionalUsuario = usuarioRepository.findByUsername(request.getUsername());

        // 2. Verificar existencia y contraseña
        if (optionalUsuario.isPresent()) {
        Usuario usuario = optionalUsuario.get(); // Obtener el objeto Usuario si existe
        
        // 3. Verificar contraseña
        return usuario.getPassword().equals(request.getPassword());
    }
    return false;
}

    public Usuario registrarNuevoUsuario(LoginRequest request) {
        
        // 1. VERIFICAR UNICIDAD
        Optional<Usuario> usuarioExistente = usuarioRepository.findByUsername(request.getUsername());
        
        if (usuarioExistente.isPresent()) {
            // Si el Optional contiene un usuario, significa que el nombre ya está tomado.
            throw new IllegalArgumentException("El nombre de usuario ya está registrado.");
        }
        
        // 2. CREAR Y ASIGNAR VALORES (Si el usuario es nuevo)
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setUsername(request.getUsername());
        nuevoUsuario.setPassword(request.getPassword());
        nuevoUsuario.setRol("Conserje"); // Rol por defecto
        
        // 3. GUARDAR en la DB
        return usuarioRepository.save(nuevoUsuario);
    }
}