package com.diseno.tpDiseno.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.diseno.tpDiseno.model.Habitacion;
import com.diseno.tpDiseno.model.Reserva;
import com.diseno.tpDiseno.Dao.ReservaDAO;
import lombok.Data;

@Service
@Data
public class GestorReserva {

private final ReservaDAO reservaDao;

public Reserva crearReserva(LocalDate fechaInicio, LocalDate fechaFin, List<Habitacion> habitaciones, 
                            String apellido, String nombre, String telefono) {
    Reserva reserva = new Reserva();
    reserva.setFechaInicio(fechaInicio);
    reserva.setFechaFin(fechaFin);
    reserva.setHabitaciones(habitaciones);
    reserva.setApellido(apellido);
    reserva.setNombre(nombre);
    reserva.setTelefono(telefono);
    reserva.setCheckedIn(false);
    reservaDao.save(reserva);
    return reserva;
}
//No es un reponse ni un request, porqeu lo llama otro Gestor.
public List<Reserva> obtenerReservaPorFecha(LocalDate fechaInicio, LocalDate fechaFin) {
    //me tengo que traer las reservas que esten entre esas fechas
    List<Reserva> reservas = reservaDao.findAllByFechaBetween(fechaInicio, fechaFin);
    return reservas; // Retornar la lista (puede estar vacía)
}

public Reserva obtenerReservaPorFechaYHabitacion(LocalDate fechaInicio, LocalDate fechaFin, Long idHabitacion) {
    List<Reserva> reservas = reservaDao.findAllByFechaBetween(fechaInicio, fechaFin);
    
    for (Reserva reserva : reservas) {
        for (Habitacion habitacion : reserva.getHabitaciones()) {
            if (habitacion.getNumero().equals(idHabitacion)) {
                return reserva;
            }
        }
    }
    
    // Si no se encuentra, retornar null o lanzar excepción según el caso de uso
    return null;
}

public void guardarReserva(Reserva reserva) {
    reservaDao.save(reserva);
}
}
