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
  selecciones: {} // { habitacionId: { inicio: Date, fin: Date } }
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
        html += `<td class='cell-estado ${claseCSS} ${clickeable}' 
                     data-habitacion='${h.numeroHabitacion}' 
                     data-fecha='${fechaKey}' 
                     data-estado='${estado}'></td>`;
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

let seleccionActual = {
  habitacion: null,
  fechaInicio: null,
  seleccionando: false
};

function agregarEventListenersSeleccion() {
  const celdas = document.querySelectorAll('.cell-estado.clickeable');
  
  celdas.forEach(celda => {
    celda.addEventListener('mousedown', (e) => {
      const habitacion = e.target.dataset.habitacion;
      const fecha = e.target.dataset.fecha;
      const estado = e.target.dataset.estado;
      
      if (estado !== 'DISPONIBLE') return;
      
      seleccionActual.habitacion = habitacion;
      seleccionActual.fechaInicio = fecha;
      seleccionActual.seleccionando = true;
      
      marcarCelda(habitacion, fecha, true);
    });
    
    celda.addEventListener('mouseenter', (e) => {
      if (!seleccionActual.seleccionando) return;
      
      const habitacion = e.target.dataset.habitacion;
      const fecha = e.target.dataset.fecha;
      
      if (habitacion !== seleccionActual.habitacion) return;
      
      actualizarSeleccionVisual(habitacion, seleccionActual.fechaInicio, fecha);
    });
  });
  
  document.addEventListener('mouseup', () => {
    if (seleccionActual.seleccionando) {
      finalizarSeleccion();
    }
  });
}

function marcarCelda(habitacion, fecha, seleccionada) {
  const celda = document.querySelector(
    `.cell-estado[data-habitacion="${habitacion}"][data-fecha="${fecha}"]`
  );
  if (celda) {
    if (seleccionada) {
      celda.classList.add('cell-seleccionada');
    } else {
      celda.classList.remove('cell-seleccionada');
    }
  }
}

function actualizarSeleccionVisual(habitacion, fechaInicio, fechaFin) {
  // Limpiar selección anterior de esta habitación
  const celdasHabitacion = document.querySelectorAll(
    `.cell-estado[data-habitacion="${habitacion}"]`
  );
  celdasHabitacion.forEach(c => c.classList.remove('cell-seleccionada'));
  
  // Determinar rango
  const f1 = new Date(fechaInicio);
  const f2 = new Date(fechaFin);
  const desde = f1 < f2 ? f1 : f2;
  const hasta = f1 < f2 ? f2 : f1;
  
  // Marcar celdas en el rango
  let actual = new Date(desde);
  while (actual <= hasta) {
    const fechaKey = actual.toISOString().split('T')[0];
    marcarCelda(habitacion, fechaKey, true);
    actual.setDate(actual.getDate() + 1);
  }
}

function finalizarSeleccion() {
  if (!seleccionActual.habitacion || !seleccionActual.fechaInicio) {
    seleccionActual.seleccionando = false;
    return;
  }
  
  // Buscar la última celda seleccionada
  const celdasSeleccionadas = document.querySelectorAll(
    `.cell-estado[data-habitacion="${seleccionActual.habitacion}"].cell-seleccionada`
  );
  
  if (celdasSeleccionadas.length > 0) {
    const fechas = Array.from(celdasSeleccionadas).map(c => c.dataset.fecha).sort();
    const fechaInicio = fechas[0];
    const fechaFin = fechas[fechas.length - 1];
    
    // Verificar que todas las celdas en el rango estén disponibles
    if (verificarDisponibilidadRango(seleccionActual.habitacion, fechaInicio, fechaFin)) {
      estadoApp.selecciones[seleccionActual.habitacion] = {
        inicio: fechaInicio,
        fin: fechaFin
      };
      actualizarResumen();
    } else {
      errorDiv.textContent = "Una o más fechas seleccionadas no están disponibles.";
      limpiarSeleccionHabitacion(seleccionActual.habitacion);
    }
  }
  
  seleccionActual.habitacion = null;
  seleccionActual.fechaInicio = null;
  seleccionActual.seleccionando = false;
}

function verificarDisponibilidadRango(habitacion, fechaInicio, fechaFin) {
  const f1 = new Date(fechaInicio);
  const f2 = new Date(fechaFin);
  
  let actual = new Date(f1);
  while (actual <= f2) {
    const fechaKey = actual.toISOString().split('T')[0];
    const celda = document.querySelector(
      `.cell-estado[data-habitacion="${habitacion}"][data-fecha="${fechaKey}"]`
    );
    if (!celda || celda.dataset.estado !== 'DISPONIBLE') {
      return false;
    }
    actual.setDate(actual.getDate() + 1);
  }
  return true;
}

function limpiarSeleccionHabitacion(habitacion) {
  const celdas = document.querySelectorAll(
    `.cell-estado[data-habitacion="${habitacion}"]`
  );
  celdas.forEach(c => c.classList.remove('cell-seleccionada'));
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
    selecciones: {}
  };
  ocultarResumenYFormulario();
  inputDesde.focus();
});
