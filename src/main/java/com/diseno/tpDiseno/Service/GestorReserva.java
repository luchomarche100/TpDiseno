package com.diseno.tpDiseno.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.diseno.tpDiseno.model.Reserva;
import com.diseno.tpDiseno.Dao.ReservaDAO;
import lombok.Data;

@Service
@Data
public class GestorReserva {



private final ReservaDAO reservaDao;

//No es un reponse ni un request, porqeu lo llama otro Gestor.
public List<Reserva> obtenerReservaPorFecha(LocalDate fechaInicio, LocalDate fechaFin) {
    //me tengo que traer las reservas que esten entre esas fechas
    List<Reserva> reservas = reservaDao.findAllByFechaBetween(fechaInicio, fechaFin);
    return reservas; // Retornar la lista (puede estar vacía)
}
}
