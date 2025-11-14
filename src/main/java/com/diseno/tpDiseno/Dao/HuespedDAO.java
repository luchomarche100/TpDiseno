package com.diseno.tpDiseno.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diseno.tpDiseno.model.Huesped;
import com.diseno.tpDiseno.util.TipoDocumentoEnum;


public interface HuespedDAO extends JpaRepository<Huesped, Long> {
   Huesped findFirstByTipoDocumentoAndNroDocumento(
            TipoDocumentoEnum tipoDocumento,
            String nroDocumento
        );
    
}
 