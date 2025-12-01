const form = document.getElementById("huespedForm");

// Modal de éxito
const modalExito = document.getElementById("modalExito");
const mensajeExito = document.getElementById("mensajeExito");
const btnOtro = document.getElementById("btnOtro");
const btnSiguiente = document.getElementById("btnSiguiente");

// Aplicar máscara de fecha al input
const inputFechaNac = document.getElementById("fechaDeNacimiento");
aplicarMascaraFecha(inputFechaNac);

// Función para mostrar el modal de éxito
function mostrarModalExito(nombres, apellido) {
  if (mensajeExito) {
    mensajeExito.textContent =
      `El huésped ${nombres} ${apellido} ha sido satisfactoriamente ` +
      `cargado al sistema.\n¿Desea cargar otro huésped?`;
  }
  modalExito.style.display = "flex";
}

// Botón "Cargar otro huésped"
btnOtro.addEventListener("click", () => {
  modalExito.style.display = "none";
  form.reset();
  form.nombres.focus();
});

// Botón "Siguiente" → ir a inicio
btnSiguiente.addEventListener("click", () => {
  window.location.href = "/inicio";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Validar fecha de nacimiento
  const fechaNacStr = form.fechaDeNacimiento.value;
  if (!validarFecha(fechaNacStr)) {
    alert("La fecha de nacimiento debe tener el formato dd/mm/aaaa");
    form.fechaDeNacimiento.focus();
    return;
  }

  const dataForm = {
    nombres: form.nombres.value,
    apellido: form.apellido.value,
    tipoDocumento: form.tipoDocumento.value,
    nroDocumento: form.nroDocumento.value,
    cuit: form.cuit.value || null,
    posIVA: form.posIVA.value,
    fechaDeNacimiento: convertirFechaAISO(form.fechaDeNacimiento.value),
    telefono: form.telefono.value,
    email: form.email.value || null,
    ocupacion: form.ocupacion.value,
    nacionalidad: form.nacionalidad.value,
    direccion: {
      calle: form.calle.value,
      nroCalle: form.numero.value,
      piso: form.piso.value,
      nroDepartamento: form.nroDepartamento.value,
      codigoPostal: form.codigoPostal.value,
      localidad: form.localidad.value,
      provincia: form.provincia.value,
      pais: form.pais.value,
    },
  };

  try {
    const response = await fetch("http://localhost:8080/api/huespedes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForm),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      if (error && error.codigo === "DATOS_OBLIGATORIOS_INCOMPLETOS") {
        // Armamos un mensaje con todos los errores de campos
        let mensaje = "Faltan completar datos obligatorios:\n\n";
        if (Array.isArray(error.errores)) {
          error.errores.forEach((e) => {
            mensaje += `- ${e.campo}: ${e.mensaje}\n`;
          });
        }
        alert(mensaje);
        return;
      }

      if (error && error.codigo === "DOCUMENTO_DUPLICADO") {
        const aceptarIgualmente = confirm(
          "¡CUIDADO! El tipo y número de documento ya existen en el sistema.\n\n" +
          "¿Desea ACEPTAR IGUALMENTE?"
        );

        if (aceptarIgualmente) {
          dataForm.tipoYDniRepetido = true;
          const response2 = await fetch("http://localhost:8080/api/huespedes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataForm),
          });
          if (!response2.ok) {
            alert("Ocurrió un error al forzar el alta.");
            return;
          }
          const result2 = await response2.json();
          // mostramos el mismo cartel de éxito
          mostrarModalExito(result2.nombres, result2.apellido);
          return;
        } else {
          document.getElementById("nroDocumento").focus();
          return;
        }
      } else {
        alert("Ocurrió un error al dar de alta el huésped.");
        return;
      }
    }

    const result = await response.json();
    // Cartel con "¿Desea cargar otro?" + botón Siguiente
    mostrarModalExito(result.nombres, result.apellido);

  } catch (err) {
    alert("No se pudo conectar con el servidor.");
  }
});

const btnCancelar = document.getElementById("cancelar");

btnCancelar.addEventListener("click", () => {
  const deseaCancelar = confirm("¿Desea cancelar el alta del huésped?");
  if (deseaCancelar) {
    form.reset();
  }
});
