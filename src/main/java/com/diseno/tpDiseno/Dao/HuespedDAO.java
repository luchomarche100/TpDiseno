package com.diseno.tpDiseno.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diseno.tpDiseno.model.Huesped;
import com.diseno.tpDiseno.util.TipoDocumentoEnum;
import com.google.common.base.Optional;

public interface HuespedDAO extends JpaRepository<Huesped, Long> {
    Optional<Huesped> findByTipoDocumentoAndNroDocumento(
            TipoDocumentoEnum tipoDocumento,
            String nroDocumento
        );
    
}
 