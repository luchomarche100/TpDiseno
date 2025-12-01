const inputDesde = document.getElementById("fechaDesde");
const inputHasta = document.getElementById("fechaHasta");
const btnBuscar = document.getElementById("btnBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");
const errorDiv = document.getElementById("error");
const successDiv = document.getElementById("success");
const gridContainer = document.getElementById("gridContainer");
const resumenContainer = document.getElementById("resumenContainer");
const formularioHuesped = document.getElementById("formularioHuesped");
const btnAceptarReserva = document.getElementById("btnAceptarReserva");
const btnRechazarReserva = document.getElementById("btnRechazarReserva");
const btnConfirmarDatos = document.getElementById("btnConfirmarDatos");
const btnCancelarDatos = document.getElementById("btnCancelarDatos");
const modalExito = document.getElementById("modalExito");
const btnCerrarModal = document.getElementById("btnCerrarModal");

// Elementos del buscador de huésped
const tipoDocBuscar = document.getElementById("tipoDocBuscar");
const nroDocBuscar = document.getElementById("nroDocBuscar");
const btnBuscarHuesped = document.getElementById("btnBuscarHuesped");
const errorBusqueda = document.getElementById("errorBusqueda");
const successBusqueda = document.getElementById("successBusqueda");
const apellidoHuesped = document.getElementById("apellidoHuesped");
const nombreHuesped = document.getElementById("nombreHuesped");
const telefonoHuesped = document.getElementById("telefonoHuesped");

// Aplicar máscaras de fecha
aplicarMascaraFecha(inputDesde);
aplicarMascaraFecha(inputHasta);

// Estado de la aplicación
let estadoApp = {
  habitaciones: [],
  fechas: [],
  fechaDesde: null,
  fechaHasta: null,
  selecciones: {}, // { habitacionId: { inicio: Date, fin: Date } }
  seleccionRango: {
    activo: false,
    habitacionId: null,
    fechaInicio: null
  }
};

// Utilidad: generar array de fechas entre dos fechas (string yyyy-mm-dd)
function generarFechas(desdeStr, hastaStr) {
  const fechas = [];
  const [yDesde, mDesde, dDesde] = desdeStr.split("-").map(Number);
  const [yHasta, mHasta, dHasta] = hastaStr.split("-").map(Number);

  let actual = new Date(yDesde, mDesde - 1, dDesde);
  const hasta = new Date(yHasta, mHasta - 1, dHasta);

  while (actual <= hasta) {
    fechas.push(new Date(actual));
    actual.setDate(actual.getDate() + 1);
  }
  return fechas;
}

// Convierte estado string → clase de color
function claseEstado(estado) {
  switch (estado) {
    case "DISPONIBLE":
      return "cell-disponible";
    case "OCUPADA":
      return "cell-ocupada";
    case "RESERVADA":
      return "cell-reservada";
    case "MANTENIMIENTO":
      return "cell-mantenimiento";
    default:
      return "";
  }
}

// Agrupa habitaciones por tipo
function agruparPorTipo(habitaciones) {
  const grupos = {};
  habitaciones.forEach((h) => {
    const tipo = h.tipoHabitacion;
    if (!grupos[tipo]) grupos[tipo] = [];
    grupos[tipo].push(h);
  });
  Object.values(grupos).forEach((lista) => {
    lista.sort((a, b) => a.numeroHabitacion - b.numeroHabitacion);
  });
  return grupos;
}

function validarFechas() {
  errorDiv.textContent = "";
  successDiv.textContent = "";

  if (!inputDesde.value) {
    errorDiv.textContent = "Debe ingresar la fecha Desde.";
    inputDesde.focus();
    return false;
  }
  if (!inputHasta.value) {
    errorDiv.textContent = "Debe ingresar la fecha Hasta.";
    inputHasta.focus();
    return false;
  }

  if (!validarFecha(inputDesde.value)) {
    errorDiv.textContent = "La fecha Desde debe tener el formato dd/mm/aaaa";
    inputDesde.focus();
    return false;
  }
  if (!validarFecha(inputHasta.value)) {
    errorDiv.textContent = "La fecha Hasta debe tener el formato dd/mm/aaaa";
    inputHasta.focus();
    return false;
  }

  const [diaD, mesD, anioD] = inputDesde.value.split("/").map(Number);
  const [diaH, mesH, anioH] = inputHasta.value.split("/").map(Number);
  const dDesde = new Date(anioD, mesD - 1, diaD);
  const dHasta = new Date(anioH, mesH - 1, diaH);

  if (dDesde > dHasta) {
    errorDiv.textContent = "La fecha Desde no puede ser posterior a la fecha Hasta.";
    inputDesde.focus();
    return false;
  }

  return true;
}

async function buscarEstadoHabitaciones() {
  if (!validarFechas()) return;

  const requestBody = {
    fechaDesde: convertirFechaAISO(inputDesde.value),
    fechaHasta: convertirFechaAISO(inputHasta.value),
  };

  try {
    const resp = await fetch("/api/habitaciones/estado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!resp.ok) {
      const error = await resp.json();
      errorDiv.textContent = error.mensaje || "Error al buscar habitaciones";
      return;
    }

    const data = await resp.json();
    estadoApp.habitaciones = data.habitaciones || [];
    estadoApp.fechaDesde = data.fechaDesde;
    estadoApp.fechaHasta = data.fechaHasta;
    estadoApp.fechas = generarFechas(data.fechaDesde, data.fechaHasta);
    estadoApp.selecciones = {};
    
    renderGrid(data);
    ocultarResumenYFormulario();
  } catch (e) {
    errorDiv.textContent = "Error de conexión con el servidor.";
    console.error(e);
  }
}

function renderGrid(data) {
  const habitaciones = data.habitaciones || [];
  if (habitaciones.length === 0) {
    gridContainer.innerHTML = "<p>No hay habitaciones disponibles.</p>";
    return;
  }

  const fechas = generarFechas(data.fechaDesde, data.fechaHasta);

  habitaciones.forEach((h) => {
    h.estadosPorFechaMap = {};
    h.estadosPorDia.forEach((ed) => {
      h.estadosPorFechaMap[ed.fecha] = ed.estado;
      // Guardar también la info de reserva si existe
      if (ed.reservaNombre || ed.reservaApellido) {
        if (!h.reservasPorFecha) h.reservasPorFecha = {};
        h.reservasPorFecha[ed.fecha] = {
          nombre: ed.reservaNombre || "",
          apellido: ed.reservaApellido || "",
          telefono: ed.reservaTelefono || ""
        };
      }
    });
  });

  const grupos = agruparPorTipo(habitaciones);

  let html = "<table class='estado-grid'>";
  html += "<thead>";
  html += "<tr>";
  html += "<th class='tipo-header fecha-header'></th>";

  Object.entries(grupos).forEach(([tipo, lista]) => {
    html += `<th class='tipo-header' colspan='${lista.length}'>${tipo.replace(/_/g, " ")}</th>`;
  });

  html += "</tr>";
  html += "<tr>";
  html += "<th class='fecha-header'>Fechas</th>";
  
  Object.values(grupos).forEach((lista) => {
    lista.forEach((h) => {
      html += `<th>${h.numeroHabitacion}</th>`;
    });
  });
  
  html += "</tr>";
  html += "</thead>";
  html += "<tbody>";

  fechas.forEach((d) => {
    const fechaKey = d.toISOString().split("T")[0];
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");

    html += "<tr>";
    html += `<td class='fecha-col'>${dia}/${mes}</td>`;

    Object.values(grupos).forEach((lista) => {
      lista.forEach((h) => {
        const estado = h.estadosPorFechaMap[fechaKey] || "DISPONIBLE";
        const claseCSS = claseEstado(estado);
        const clickeable = estado === "DISPONIBLE" ? 'clickeable' : '';
        
        // Agregar data attributes con info de reserva si existe
        let dataAttr = `data-habitacion='${h.numeroHabitacion}' data-fecha='${fechaKey}' data-estado='${estado}'`;
        
        if (estado === "RESERVADA" && h.reservasPorFecha && h.reservasPorFecha[fechaKey]) {
          const reserva = h.reservasPorFecha[fechaKey];
          dataAttr += ` data-reserva-nombre='${reserva.nombre}' data-reserva-apellido='${reserva.apellido}' data-reserva-telefono='${reserva.telefono}'`;
        }
        
        html += `<td class='cell-estado ${claseCSS} ${clickeable}' ${dataAttr}></td>`;
      });
    });

    html += "</tr>";
  });

  html += "</tbody>";
  html += "</table>";

  gridContainer.innerHTML = html;
  
  // Agregar event listeners para selección
  agregarEventListenersSeleccion();
}

function agregarEventListenersSeleccion() {
  const celdas = document.querySelectorAll('.cell-estado.clickeable');
  
  celdas.forEach(celda => {
    celda.addEventListener('click', manejarClickCelda);
    celda.addEventListener('contextmenu', manejarClickDerechoCelda);
    celda.addEventListener('mouseenter', manejarHoverCelda);
  });
}

function manejarClickDerechoCelda(event) {
  event.preventDefault(); // Evitar menú contextual
  
  const celda = event.target;
  const habitacionId = celda.dataset.habitacion;
  const fecha = celda.dataset.fecha;
  
  // Si esta habitación tiene selección, limpiarla
  if (estadoApp.selecciones[habitacionId]) {
    delete estadoApp.selecciones[habitacionId];
    limpiarSeleccionHabitacion(habitacionId);
    actualizarResumen();
  }
}

function manejarClickCelda(event) {
  const celda = event.target;
  const habitacionId = celda.dataset.habitacion;
  const fecha = celda.dataset.fecha;
  const estado = celda.dataset.estado;

  // Si no hay selección activa, iniciar una nueva
  if (!estadoApp.seleccionRango.activo) {
    estadoApp.seleccionRango.activo = true;
    estadoApp.seleccionRango.habitacionId = habitacionId;
    estadoApp.seleccionRango.fechaInicio = fecha;
    
    // Marcar visualmente como inicio de selección
    celda.style.border = "3px solid #fbbf24";
  } else {
    // Si ya hay una selección activa y es de la misma habitación
    if (estadoApp.seleccionRango.habitacionId === habitacionId) {
      const fechaFin = fecha;
      const fechaIni = estadoApp.seleccionRango.fechaInicio;
      
      // Limpiar el borde de la primera celda
      const primeraCelda = document.querySelector(
        `.cell-estado[data-habitacion="${habitacionId}"][data-fecha="${fechaIni}"]`
      );
      if (primeraCelda) primeraCelda.style.border = "";
      
      // Seleccionar todas las celdas en el rango
      seleccionarRangoCeldas(habitacionId, fechaIni, fechaFin);
      
      // Resetear el estado de selección de rango
      estadoApp.seleccionRango = {
        activo: false,
        habitacionId: null,
        fechaInicio: null
      };
    } else {
      // Si es de otra habitación, cancelar la selección anterior y empezar nueva
      const celdaAnterior = document.querySelector(
        `.cell-estado[data-habitacion="${estadoApp.seleccionRango.habitacionId}"][data-fecha="${estadoApp.seleccionRango.fechaInicio}"]`
      );
      if (celdaAnterior) celdaAnterior.style.border = "";
      
      estadoApp.seleccionRango.activo = true;
      estadoApp.seleccionRango.habitacionId = habitacionId;
      estadoApp.seleccionRango.fechaInicio = fecha;
      celda.style.border = "3px solid #fbbf24";
    }
  }
  
  // Limpiar previews
  document.querySelectorAll(".cell-preview").forEach(c => {
    c.classList.remove("cell-preview");
  });
}

function manejarHoverCelda(event) {
  if (!estadoApp.seleccionRango.activo) return;
  
  const celda = event.target;
  const habitacionId = celda.dataset.habitacion;
  const fecha = celda.dataset.fecha;
  
  // Solo mostrar preview si es de la misma habitación
  if (estadoApp.seleccionRango.habitacionId === habitacionId) {
    // Limpiar previews anteriores
    document.querySelectorAll(".cell-preview").forEach(c => {
      c.classList.remove("cell-preview");
    });
    
    // Mostrar preview del rango
    const fechaIni = estadoApp.seleccionRango.fechaInicio;
    const fechaFin = fecha;
    const [f1, f2] = fechaIni <= fechaFin ? [fechaIni, fechaFin] : [fechaFin, fechaIni];
    
    const todasCeldas = gridContainer.querySelectorAll(".cell-estado[data-habitacion]");
    todasCeldas.forEach(c => {
      if (c.dataset.habitacion === habitacionId) {
        const f = c.dataset.fecha;
        if (f >= f1 && f <= f2) {
          c.classList.add("cell-preview");
        }
      }
    });
  }
}

function seleccionarRangoCeldas(habitacionId, fechaIni, fechaFin) {
  // Determinar el orden correcto de las fechas
  const [f1, f2] = fechaIni <= fechaFin ? [fechaIni, fechaFin] : [fechaFin, fechaIni];
  
  // Verificar si hay celdas no disponibles en el rango
  const todasCeldas = gridContainer.querySelectorAll(".cell-estado[data-habitacion]");
  const celdasEnRango = [];
  let hayReservada = false;
  const fechasReservadas = [];
  
  todasCeldas.forEach(celda => {
    if (celda.dataset.habitacion === habitacionId) {
      const f = celda.dataset.fecha;
      if (f >= f1 && f <= f2) {
        celdasEnRango.push(celda);
        if (celda.dataset.estado !== "DISPONIBLE") {
          if (celda.dataset.estado === "RESERVADA") {
            hayReservada = true;
            fechasReservadas.push(f);
          } else {
            // Si hay alguna celda ocupada o en mantenimiento, no permitir
            errorDiv.textContent = `No se puede reservar: la habitación ${habitacionId} tiene días no disponibles en el rango seleccionado.`;
            return;
          }
        }
      }
    }
  });
  
  // Si hay alguna reservada, mostrar advertencia
  if (hayReservada) {
    buscarInfoReservaYConfirmar(habitacionId, fechasReservadas, celdasEnRango, f1, f2);
    return;
  }
  
  // Si todas están disponibles, seleccionar
  seleccionarCeldas(habitacionId, celdasEnRango, f1, f2);
}

function seleccionarCeldas(habitacionId, celdasEnRango, f1, f2) {
  // Limpiar selección anterior de esta habitación
  limpiarSeleccionHabitacion(habitacionId);
  
  // Marcar todas las celdas del rango
  celdasEnRango.forEach(celda => {
    celda.classList.add("cell-seleccionada");
  });
  
  // Guardar en estadoApp.selecciones
  estadoApp.selecciones[habitacionId] = {
    inicio: f1,
    fin: f2
  };
  
  // Limpiar previews
  document.querySelectorAll(".cell-preview").forEach(c => {
    c.classList.remove("cell-preview");
  });
  
  actualizarResumen();
}

async function buscarInfoReservaYConfirmar(habitacionId, fechasReservadas, celdasEnRango, f1, f2) {
  try {
    let infoReservas = new Map();
    
    // Recopilar información de reservas de las celdas
    celdasEnRango.forEach(celda => {
      if (celda.dataset.estado === "RESERVADA") {
        const fecha = celda.dataset.fecha;
        const nombre = celda.dataset.reservaNombre || "";
        const apellido = celda.dataset.reservaApellido || "";
        const telefono = celda.dataset.reservaTelefono || "";
        
        if (nombre || apellido) {
          const key = `${nombre} ${apellido}`.trim();
          if (!infoReservas.has(key)) {
            infoReservas.set(key, {
              nombre: nombre,
              apellido: apellido,
              telefono: telefono,
              fechas: []
            });
          }
          infoReservas.get(key).fechas.push(fecha);
        }
      }
    });
    
    // Construir mensaje de confirmación
    const fechasFormateadas = fechasReservadas.map(f => convertirFechaAArgentina(f)).join(", ");
    
    let mensaje = `⚠️ ADVERTENCIA: Esta habitación tiene fechas RESERVADAS\n\n`;
    mensaje += `Habitación: ${habitacionId}\n`;
    mensaje += `Fechas reservadas: ${fechasFormateadas}\n`;
    mensaje += `Cantidad de días: ${fechasReservadas.length}\n\n`;
    
    if (infoReservas.size > 0) {
      mensaje += `Información de reserva(s):\n`;
      infoReservas.forEach((info, key) => {
        if (key) {
          mensaje += `\n- Titular: ${info.nombre} ${info.apellido}\n`;
          if (info.telefono) {
            mensaje += `  Teléfono: ${info.telefono}\n`;
          }
          mensaje += `  Días: ${info.fechas.length}\n`;
        }
      });
      mensaje += `\n`;
    }
    
    mensaje += `¿Desea RESERVAR de todas formas?\n`;
    mensaje += `(Esto puede generar conflictos con la reserva existente)`;
    
    const confirmar = confirm(mensaje);
    
    if (confirmar) {
      seleccionarCeldas(habitacionId, celdasEnRango, f1, f2);
    }
  } catch (error) {
    console.error("Error al buscar info de reserva:", error);
    
    const confirmar = confirm(
      `Esta habitación tiene fechas RESERVADAS.\n¿Desea reservarla de todas formas?`
    );
    
    if (confirmar) {
      seleccionarCeldas(habitacionId, celdasEnRango, f1, f2);
    }
  }
}

function limpiarSeleccionHabitacion(habitacion) {
  const celdas = document.querySelectorAll(
    `.cell-estado[data-habitacion="${habitacion}"]`
  );
  celdas.forEach(c => {
    c.classList.remove('cell-seleccionada');
    c.style.border = "";
  });
  delete estadoApp.selecciones[habitacion];
}

function actualizarResumen() {
  const numSelecciones = Object.keys(estadoApp.selecciones).length;
  
  if (numSelecciones === 0) {
    ocultarResumenYFormulario();
    return;
  }
  
  resumenContainer.classList.add('visible');
  
  let htmlResumen = '<div class="resumen-title">Reserva seleccionada</div>';
  
  Object.entries(estadoApp.selecciones).forEach(([habitacion, rango]) => {
    const hab = estadoApp.habitaciones.find(h => h.numeroHabitacion == habitacion);
    const tipo = hab ? hab.tipoHabitacion.replace(/_/g, " ") : "";
    
    htmlResumen += `
      <div class="resumen-item">
        <span class="resumen-label">Habitación ${habitacion} (${tipo})</span>
        <span class="resumen-value">${convertirFechaAArgentina(rango.inicio)} - ${convertirFechaAArgentina(rango.fin)}</span>
      </div>
    `;
  });
  
  htmlResumen += `
    <div style="margin-top: 16px;">
      <p style="font-size: 13px; color: #9ca3af; margin-bottom: 8px;">
        Ingreso: 12:00hs | Egreso: 10:00hs
      </p>
      <div class="buttons-row">
        <button class="btn btn-success" id="btnAceptarReserva">ACEPTAR</button>
        <button class="btn btn-danger" id="btnRechazarReserva">RECHAZAR</button>
      </div>
    </div>
  `;
  
  document.getElementById('resumenContent').innerHTML = htmlResumen;
  
  // Re-asignar event listeners
  document.getElementById('btnAceptarReserva').addEventListener('click', mostrarFormularioHuesped);
  document.getElementById('btnRechazarReserva').addEventListener('click', rechazarReserva);
}

function rechazarReserva() {
  // Limpiar todas las selecciones
  Object.keys(estadoApp.selecciones).forEach(habitacion => {
    limpiarSeleccionHabitacion(habitacion);
  });
  estadoApp.selecciones = {};
  ocultarResumenYFormulario();
  errorDiv.textContent = "";
  successDiv.textContent = "";
}

function mostrarFormularioHuesped() {
  formularioHuesped.classList.add('visible');
  document.getElementById('apellidoHuesped').focus();
}

function ocultarResumenYFormulario() {
  resumenContainer.classList.remove('visible');
  formularioHuesped.classList.remove('visible');
}

btnConfirmarDatos.addEventListener('click', async () => {
  errorDiv.textContent = "";
  successDiv.textContent = "";
  
  // Limpiar errores previos
  document.querySelectorAll('.form-field').forEach(field => {
    field.classList.remove('error');
    const errorText = field.querySelector('.error-text');
    if (errorText) errorText.remove();
  });
  
  const apellido = document.getElementById('apellidoHuesped').value.trim();
  const nombre = document.getElementById('nombreHuesped').value.trim();
  const telefono = document.getElementById('telefonoHuesped').value.trim();
  
  // Validación básica
  let hayErrores = false;
  
  if (!apellido) {
    mostrarErrorCampo('apellidoHuesped', 'El apellido es obligatorio');
    hayErrores = true;
  }
  
  if (!nombre) {
    mostrarErrorCampo('nombreHuesped', 'El nombre es obligatorio');
    hayErrores = true;
  }
  
  if (!telefono) {
    mostrarErrorCampo('telefonoHuesped', 'El teléfono es obligatorio');
    hayErrores = true;
  } else if (!/^\d{6,15}$/.test(telefono)) {
    mostrarErrorCampo('telefonoHuesped', 'El teléfono debe tener entre 6 y 15 dígitos');
    hayErrores = true;
  }
  
  if (hayErrores) {
    errorDiv.textContent = "Por favor, complete todos los campos correctamente.";
    return;
  }
  
  // Construir request
  const habitacionesIds = Object.keys(estadoApp.selecciones).map(Number);
  
  // Para simplificar, tomamos el primer rango (en un caso real podrías manejar múltiples)
  const primerRango = estadoApp.selecciones[habitacionesIds[0]];
  
  const requestBody = {
    habitacionesIds: habitacionesIds,
    fechaInicio: primerRango.inicio,
    fechaFin: primerRango.fin,
    apellido: apellido,
    nombre: nombre,
    telefono: telefono
  };
  
  try {
    const resp = await fetch("/api/habitaciones/reservar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    
    if (!resp.ok) {
      const error = await resp.json();
      
      // Mostrar errores por campo si existen
      if (error.errores && Array.isArray(error.errores)) {
        error.errores.forEach(err => {
          const campo = err.campo.replace('habitacion_', '');
          mostrarErrorCampo(campo, err.mensaje);
        });
      }
      
      errorDiv.textContent = error.mensaje || "Error al crear la reserva";
      return;
    }
    
    const data = await resp.json();
    mostrarModalExito(data);
    
  } catch (e) {
    errorDiv.textContent = "Error de conexión con el servidor.";
    console.error(e);
  }
});

function mostrarErrorCampo(campoId, mensaje) {
  const campo = document.getElementById(campoId);
  if (campo) {
    const formField = campo.closest('.form-field');
    formField.classList.add('error');
    
    const errorText = document.createElement('span');
    errorText.className = 'error-text';
    errorText.textContent = mensaje;
    formField.appendChild(errorText);
  }
}

function mostrarModalExito(data) {
  const modalBody = document.getElementById('modalExitoBody');
  
  const habitacionesTexto = data.habitacionesIds.join(', ');
  
  modalBody.innerHTML = `
    <p><strong>Reserva creada exitosamente</strong></p>
    <p><strong>ID Reserva:</strong> ${data.idReserva}</p>
    <p><strong>A nombre de:</strong> ${data.apellido}, ${data.nombre}</p>
    <p><strong>Teléfono:</strong> ${data.telefono}</p>
    <p><strong>Habitación(es):</strong> ${habitacionesTexto}</p>
    <p><strong>Desde:</strong> ${convertirFechaAArgentina(data.fechaInicio)} 12:00hs</p>
    <p><strong>Hasta:</strong> ${convertirFechaAArgentina(data.fechaFin)} 10:00hs</p>
  `;
  
  modalExito.classList.add('visible');
}

btnCerrarModal.addEventListener('click', () => {
  modalExito.classList.remove('visible');
  limpiarFormulario();
  buscarEstadoHabitaciones(); // Recargar grilla
});

btnCancelarDatos.addEventListener('click', () => {
  formularioHuesped.classList.remove('visible');
  limpiarFormulario();
});

function limpiarFormulario() {
  apellidoHuesped.value = '';
  nombreHuesped.value = '';
  telefonoHuesped.value = '';
  tipoDocBuscar.value = '';
  nroDocBuscar.value = '';
  errorBusqueda.textContent = '';
  successBusqueda.textContent = '';
  
  document.querySelectorAll('.form-field').forEach(field => {
    field.classList.remove('error');
    const errorText = field.querySelector('.error-text');
    if (errorText) errorText.remove();
  });
}

// Buscar huésped por documento
btnBuscarHuesped.addEventListener('click', async () => {
  errorBusqueda.textContent = '';
  successBusqueda.textContent = '';
  
  const tipoDoc = tipoDocBuscar.value;
  const nroDoc = nroDocBuscar.value.trim();
  
  if (!tipoDoc) {
    errorBusqueda.textContent = 'Debe seleccionar el tipo de documento';
    return;
  }
  
  if (!nroDoc) {
    errorBusqueda.textContent = 'Debe ingresar el número de documento';
    return;
  }
  
  try {
    const response = await fetch('/api/huespedes/buscar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipoDocumento: tipoDoc,
        nroDocumento: nroDoc
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      errorBusqueda.textContent = data.mensaje || 'Error al buscar huésped';
      return;
    }
    
    if (data.huespedes && data.huespedes.length > 0) {
      const huesped = data.huespedes[0];
      apellidoHuesped.value = huesped.apellido || '';
      nombreHuesped.value = huesped.nombres || '';
      telefonoHuesped.value = huesped.telefono || '';
      successBusqueda.textContent = '✓ Huésped encontrado';
      
      // Limpiar después de 3 segundos
      setTimeout(() => {
        successBusqueda.textContent = '';
      }, 3000);
    } else {
      errorBusqueda.textContent = 'No se encontró ningún huésped con ese documento';
    }
  } catch (error) {
    console.error('Error al buscar huésped:', error);
    errorBusqueda.textContent = 'Error de conexión al buscar huésped';
  }
});

btnBuscar.addEventListener("click", buscarEstadoHabitaciones);

btnLimpiar.addEventListener("click", () => {
  inputDesde.value = "";
  inputHasta.value = "";
  errorDiv.textContent = "";
  successDiv.textContent = "";
  gridContainer.innerHTML = "";
  estadoApp = {
    habitaciones: [],
    fechas: [],
    fechaDesde: null,
    fechaHasta: null,
    selecciones: {},
    seleccionRango: {
      activo: false,
      habitacionId: null,
      fechaInicio: null
    }
  };
  ocultarResumenYFormulario();
  inputDesde.focus();
});
