package com.diseno.tpDiseno.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diseno.tpDiseno.model.NotaDeCredito;

public interface NotaDeCreditoDAO extends JpaRepository<NotaDeCredito, Long> {
    
}
