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

         // Query personalizada con parámetros opcionales
 @Query(value = "SELECT h.* FROM huesped h WHERE " +
           "(CAST(:nombre AS VARCHAR) IS NULL OR h.nombres LIKE CONCAT('%', CAST(:nombre AS VARCHAR), '%')) AND " +
           "(CAST(:apellido AS VARCHAR) IS NULL OR h.apellido LIKE CONCAT('%', CAST(:apellido AS VARCHAR), '%')) AND " +
           "(CAST(:tipoDocumento AS VARCHAR) IS NULL OR h.tipo_documento = CAST(:tipoDocumento AS VARCHAR)) AND " +
           "(CAST(:nroDocumento AS VARCHAR) IS NULL OR h.nro_documento = CAST(:nroDocumento AS VARCHAR))",
           nativeQuery = true)
    List<Huesped> buscarHuespedes(
            @Param("nombre") String nombre,
            @Param("apellido") String apellido,
            @Param("tipoDocumento") String tipoDocumento,
            @Param("nroDocumento") String nroDocumento
    );
    

        }

 