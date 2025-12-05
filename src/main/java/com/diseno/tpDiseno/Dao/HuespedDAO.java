package com.diseno.tpDiseno.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.diseno.tpDiseno.model.Huesped;
import com.diseno.tpDiseno.util.TipoDocumentoEnum;


public interface HuespedDAO extends JpaRepository<Huesped, Long> {
   Huesped findFirstByTipoDocumentoAndNroDocumento(
            TipoDocumentoEnum tipoDocumento,
            String nroDocumento
        );

    
    List<Huesped> findByNombresContainingIgnoreCase(String nombres);
    List<Huesped> findByApellidoContainingIgnoreCase(String apellido);
    List<Huesped> findByTipoDocumento(TipoDocumentoEnum tipoDocumento);
    List<Huesped> findByNroDocumento(String nroDocumento);
    List<Huesped> findByTipoDocumentoAndNroDocumento(TipoDocumentoEnum tipoDocumento,
         String nroDocumento);

 @Query(value = "SELECT h.* FROM huesped h WHERE " +
           "(:nombre IS NULL OR :nombre = '' OR LOWER(h.nombres) LIKE LOWER(CONCAT('%', :nombre, '%'))) AND " +
           "(:apellido IS NULL OR :apellido = '' OR LOWER(h.apellido) LIKE LOWER(CONCAT('%', :apellido, '%'))) AND " +
           "(:tipoDocumento IS NULL OR :tipoDocumento = '' OR h.tipo_documento = :tipoDocumento) AND " +
           "(:nroDocumento IS NULL OR :nroDocumento = '' OR h.nro_documento = :nroDocumento)",
           nativeQuery = true)
    List<Huesped> buscarHuespedes(
            @Param("nombre") String nombre,
            @Param("apellido") String apellido,
            @Param("tipoDocumento") String tipoDocumento,
            @Param("nroDocumento") String nroDocumento
    );
    

        }

 