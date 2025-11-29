package com.diseno.tpDiseno.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import org.springframework.stereotype.Component;

import com.diseno.tpDiseno.Exception.ReglaNegocioException;
import com.diseno.tpDiseno.dto.request.DireccionRequest;
import com.diseno.tpDiseno.dto.request.LoginRequest;
import com.diseno.tpDiseno.dto.request.MostrarEstadoRequest;
import com.diseno.tpDiseno.dto.request.SolicitudHuespedRequest;
import com.diseno.tpDiseno.util.ErrorCampo;

@Component
public class Validador {

    public boolean validarFechaHasta(MostrarEstadoRequest request) {
        if (request == null) {
            throw new ReglaNegocioException(
                "REQUEST_NULO",
                "El request no puede ser nulo.",
                List.of(crearError("fechaHasta", "Request nulo"))
            );
        }

        LocalDate fechaHasta = request.getFechaHasta();
        if (fechaHasta == null) {
            throw new ReglaNegocioException(
                "Fecha_Hasta_Nula",
                "La fecha hasta no puede ser nula.",
                List.of(crearError("fechaHasta", "La fecha hasta no puede ser nula."))
            );
        }

        LocalDate hoy = LocalDate.now();
        if (fechaHasta.isBefore(hoy)) {
            throw new ReglaNegocioException(
                "Fecha_Hasta_Anterior",
                "La fecha hasta no puede ser anterior a hoy.",
                List.of(crearError("fechaHasta", "La fecha hasta no puede ser anterior a hoy."))
            );
        }

        LocalDate fechaDesde = request.getFechaDesde();
        if (fechaDesde != null && fechaHasta.isBefore(fechaDesde)) {
            throw new ReglaNegocioException(
                "Fecha_Hasta_Menor_Que_Desde",
                "La fecha hasta no puede ser anterior a la fecha desde.",
                List.of(crearError("fechaHasta", "La fecha hasta no puede ser anterior a la fecha desde."))
            );
        }

        return true;
    }
    
    public boolean validarFechaDesde(MostrarEstadoRequest request) {
        if (request == null) {
            throw new ReglaNegocioException(
                    "REQUEST_NULO",
                    "El request no puede ser nulo.",
                    List.of(crearError("fechaDesde", "No se enviaron datos."))
            );
        }

        LocalDate fechaDesde = request.getFechaDesde();
        if (fechaDesde == null) {
            throw new ReglaNegocioException(
                    "FECHA_DESDE_NULA",
                    "La fecha desde no puede ser nula.",
                    List.of(crearError("fechaDesde", "La fecha desde no puede ser nula."))
            );
        }

        // La fecha desde debe ser hoy o posterior
        LocalDate hoy = LocalDate.now();
        if (fechaDesde.isBefore(hoy)) {
            throw new ReglaNegocioException(
                    "FECHA_DESDE_PASADA",
                    "La fecha desde no puede ser anterior a hoy.",
                    null
            );
        }

        return true;
    }
    
    public List<ErrorCampo> validar(SolicitudHuespedRequest req) {
        if (req == null) {
            throw new ReglaNegocioException(
                    "HUESPED_NULO",
                    "El huésped no puede ser nulo.",
                    List.of()
            );
        } 

        List<ErrorCampo> errores = new ArrayList<>();

        // --- Datos personales ---
        if (!esNombreValido(req.getNombres())) {
            errores.add(crearError("nombres", "El nombre no puede estar vacío."));
        }

        if (!esApellidoValido(req.getApellido())) {
            errores.add(crearError("apellido", "El apellido no puede estar vacío."));
        }

        if (!esTipoDocumentoValido(req.getTipoDocumento())) {
            errores.add(crearError("tipoDocumento", "El tipo de documento no puede estar vacío."));
        }

        esDniValido(req.getNroDocumento(), req.getTipoDocumento(), errores);

        // Email es opcional, solo valida formato si está presente
        if (req.getEmail() != null && !req.getEmail().trim().isEmpty() && !esEmailValido(req.getEmail())) {
            errores.add(crearError("email", "El formato del email no es válido."));
        }

        if (!esTelefonoValido(req.getTelefono())) {
            errores.add(crearError("telefono", "El teléfono debe tener entre 6 y 15 dígitos."));
        }

        if (!esOcupacionValida(req.getOcupacion())) {
            errores.add(crearError("ocupacion", "La ocupación no puede estar vacía."));
        }

        if (!esNacionalidadValida(req.getNacionalidad())) {
            errores.add(crearError("nacionalidad", "La nacionalidad no puede estar vacía."));
        }

        if (!esFechaNacimientoValida(req.getFechaDeNacimiento())) {
            errores.add(crearError("fechaDeNacimiento", "La fecha de nacimiento es obligatoria."));
        }

        // --- CUIT / IVA ---
        // CUIT es opcional, solo valida formato si está presente
        if (req.getCUIT() != null && !req.getCUIT().trim().isEmpty() && !esCuitValido(req.getCUIT())) {
            errores.add(crearError("CUIT", "El CUIT debe tener 11 dígitos numéricos."));
        }

        if (!esPosIvaValida(req.getPosIVA())) {
            errores.add(crearError("posIVA", "La posición de IVA no puede estar vacía."));
        }

        // --- Dirección ---
        if (req.getDireccion() == null) {
            errores.add(crearError("direccion", "La dirección es obligatoria."));
        } else {
            validarDireccion(req.getDireccion(), errores);
        }

        // Retorna los errores encontrados
        return errores;
    }

    private void validarDireccion(DireccionRequest dir, List<ErrorCampo> errores) {

        if (!esTextoNoVacio(dir.getCalle())) {
            errores.add(crearError("direccion.calle", "La calle no puede estar vacía."));
        }

        if (!esNumeroPositivo(dir.getNroCalle())) {
            errores.add(crearError("direccion.nroCalle", "El número de calle debe ser un número positivo."));
        }

        if (!esNumeroNoNegativo(dir.getPiso())) {
            errores.add(crearError("direccion.piso", "El piso debe ser un número no negativo."));
        }

        if (!esTextoNoVacio(dir.getNroDepartamento())) {
            errores.add(crearError("direccion.nroDepartamento", "El número/letra de departamento no puede estar vacío."));
        }

        if (!esTextoNoVacio(dir.getLocalidad())) {
            errores.add(crearError("direccion.localidad", "La localidad no puede estar vacía."));
        }

        if (!esTextoNoVacio(dir.getProvincia())) {
            errores.add(crearError("direccion.provincia", "La provincia no puede estar vacía."));
        }

        if (!esTextoNoVacio(dir.getPais())) {
            errores.add(crearError("direccion.pais", "El país no puede estar vacío."));
        }

        if (!esNumeroPositivo(dir.getCodigoPostal())) {
            errores.add(crearError("direccion.codigoPostal", "El código postal debe ser un número positivo."));
        }
    }
    
    // Método auxiliar para crear ErrorCampo
    private ErrorCampo crearError(String campo, String mensaje) {
        ErrorCampo error = new ErrorCampo();
        error.setCampo(campo);
        error.setMensaje(mensaje);
        return error;
    }
    
    // Validaciones individuales

    private boolean esTextoNoVacio(String valor) {
        return valor != null && !valor.trim().isEmpty();
    }

    private boolean esNombreValido(String nombre) {
        return esTextoNoVacio(nombre);
    }

    private boolean esApellidoValido(String apellido) {
        return esTextoNoVacio(apellido);
    }

    private boolean esTipoDocumentoValido(String tipoDoc) {
        return esTextoNoVacio(tipoDoc);
    }

    private void esDniValido(String dni, String tipoDoc, List<ErrorCampo> errores) {
        if(dni == null || dni.trim().isEmpty()) {
            errores.add(crearError("nroDocumento", "El número de documento no puede estar vacío."));
            return;
        }else if (tipoDoc.equalsIgnoreCase("DNI")) {
            if (!dni.matches("\\d{7,8}")) {
                errores.add(crearError("nroDocumento", "El DNI debe tener 7 u 8 dígitos numéricos."));
            }
        } else if (tipoDoc.equalsIgnoreCase("Pasaporte")) {
            if (!dni.matches("[a-zA-Z0-9]{5,15}")) {
                errores.add(crearError("nroDocumento", "El pasaporte debe tener entre 5 y 15 caracteres alfanuméricos."));
            }
        }
        return;
    }

    private boolean esEmailValido(String email) {
        return email != null && !email.trim().isEmpty() && email.matches("^[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$");
    }

    private boolean esTelefonoValido(String telefono) {
        if (telefono == null || telefono.trim().isEmpty()) return false;
        return telefono.matches("\\d{6,15}");
    }

    private boolean esOcupacionValida(String ocupacion) {
        return esTextoNoVacio(ocupacion);
    }

    private boolean esNacionalidadValida(String nacionalidad) {
        return esTextoNoVacio(nacionalidad);
    }

    private boolean esCuitValido(String cuit) {
        return cuit != null && !cuit.trim().isEmpty() && cuit.trim().matches("\\d{11}");
    }

    private boolean esPosIvaValida(String posIVA) {
        return esTextoNoVacio(posIVA);
    }

    private boolean esFechaNacimientoValida(LocalDate fecha) {
        return fecha != null; // acá después podés agregar lógica (mayor de 18, etc.)
    }

    private boolean esNumeroPositivo(Integer valor) {
        return valor != null && valor > 0;
    }

    private boolean esNumeroNoNegativo(Integer valor) {
        return valor != null && valor >= 0;
    }
     public List <ErrorCampo> validarLogin (LoginRequest req) {
        List<ErrorCampo> errores = new ArrayList<>();

        // 1. Verificar Nombre de Usuario
    if (req.getUsername() == null || req.getUsername().trim().isEmpty()) {
        errores.add(crearError("username", "El nombre de usuario no puede estar vacío."));
    }

    // 2. Verificar Contraseña
    if (req.getPassword() == null || req.getPassword().isEmpty()) {
        errores.add(crearError("password", "La contraseña es obligatoria."));
    }

        return errores;
    }
}
