// ============================================================
// VARIABLES GLOBALES
// ============================================================
const inputDesde = document.getElementById("fechaDesde");
const inputHasta = document.getElementById("fechaHasta");
const btnMostrarEstado = document.getElementById("btnMostrarEstado");
const btnLimpiarFechas = document.getElementById("btnLimpiarFechas");
const btnContinuar = document.getElementById("btnContinuar");
const errorFechas = document.getElementById("errorFechas");
const gridContainer = document.getElementById("gridContainer");
const legendContainer = document.getElementById("legendContainer");
const btnContinuarContainer = document.getElementById("btnContinuarContainer");
const instruccionesSeleccion = document.getElementById("instruccionesSeleccion");
const btnCancelarSeleccion = document.getElementById("btnCancelarSeleccion");

const paso1Card = document.getElementById("paso1Card");
const paso2Card = document.getElementById("paso2Card");
const paso3Card = document.getElementById("paso3Card");

const btnBuscarHuesped = document.getElementById("btnBuscarHuesped");
const btnConfirmarOcupacion = document.getElementById("btnConfirmarOcupacion");
const btnVolverPaso1 = document.getElementById("btnVolverPaso1");

const buscarNombre = document.getElementById("buscarNombre");
const buscarApellido = document.getElementById("buscarApellido");
const buscarTipoDoc = document.getElementById("buscarTipoDoc");
const buscarNumDoc = document.getElementById("buscarNumDoc");
const errorBusqueda = document.getElementById("errorBusqueda");
const resultadosBusqueda = document.getElementById("resultadosBusqueda");

const titularInfo = document.getElementById("titularInfo");
const listaAcompanantes = document.getElementById("listaAcompanantes");
const mensajeConfirmacion = document.getElementById("mensajeConfirmacion");

// Estado de la aplicación
let estadoApp = {
  fechaDesde: null,
  fechaHasta: null,
  habitacionesSeleccionadas: new Map(), // key: "habitacionId-fecha", value: { habitacionId, fecha, numeroHabitacion }
  habitacionesData: [], // datos de las habitaciones del backend
  huespedTitular: null,
  acompanantes: [],
  seleccionRango: {
    activo: false,
    habitacionId: null,
    fechaInicio: null,
    celdas: []
  }
};

// ============================================================
// PASO 1: SELECCIONAR HABITACIONES
// ============================================================

// Aplicar máscaras de fecha
aplicarMascaraFecha(inputDesde);
aplicarMascaraFecha(inputHasta);

function validarFechas() {
  errorFechas.textContent = "";

  if (!inputDesde.value) {
    errorFechas.textContent = "Debe ingresar la fecha Desde.";
    inputDesde.focus();
    return false;
  }
  if (!inputHasta.value) {
    errorFechas.textContent = "Debe ingresar la fecha Hasta.";
    inputHasta.focus();
    return false;
  }

  if (!validarFecha(inputDesde.value)) {
    errorFechas.textContent = "La fecha Desde debe tener el formato dd/mm/aaaa";
    inputDesde.focus();
    return false;
  }
  if (!validarFecha(inputHasta.value)) {
    errorFechas.textContent = "La fecha Hasta debe tener el formato dd/mm/aaaa";
    inputHasta.focus();
    return false;
  }

  const [diaD, mesD, anioD] = inputDesde.value.split("/").map(Number);
  const [diaH, mesH, anioH] = inputHasta.value.split("/").map(Number);
  const dDesde = new Date(anioD, mesD - 1, diaD);
  const dHasta = new Date(anioH, mesH - 1, diaH);

  if (dDesde > dHasta) {
    errorFechas.textContent = "La fecha Desde no puede ser posterior a la fecha Hasta.";
    inputDesde.focus();
    return false;
  }

  return true;
}

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

async function mostrarEstadoHabitaciones() {
  if (!validarFechas()) return;

  const requestBody = {
    fechaDesde: convertirFechaAISO(inputDesde.value),
    fechaHasta: convertirFechaAISO(inputHasta.value),
  };

  estadoApp.fechaDesde = requestBody.fechaDesde;
  estadoApp.fechaHasta = requestBody.fechaHasta;

  try {
    const resp = await fetch("/api/habitaciones/estado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!resp.ok) {
      let msg = "Error al consultar el estado de las habitaciones.";
      try {
        const errJson = await resp.json();
        if (errJson && errJson.detalle) msg = errJson.detalle;
      } catch (_) {}
      errorFechas.textContent = msg;
      return;
    }

    const data = await resp.json();
    estadoApp.habitacionesData = data.habitaciones || [];
    renderGrid(data);
  } catch (e) {
    console.error(e);
    errorFechas.textContent = "No se pudo conectar con el servidor.";
  }
}

function renderGrid(data) {
  const habitaciones = data.habitaciones || [];
  if (habitaciones.length === 0) {
    gridContainer.innerHTML = "<p style='padding: 12px;'>No hay habitaciones para el rango seleccionado.</p>";
    gridContainer.style.display = "block";
    return;
  }

  const fechas = generarFechas(data.fechaDesde, data.fechaHasta);

  habitaciones.forEach((h) => {
    h.estadoPorFecha = {};
    (h.estadosPorDia || []).forEach((ed) => {
      h.estadoPorFecha[ed.fecha] = ed.estado;
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
    html += `<th class='tipo-header' colspan='${lista.length}'>${tipo.replaceAll("_", " ")}</th>`;
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
    const iso = d.toISOString().substring(0, 10);
    html += "<tr>";
    html += `<td class='fecha-col'>${formatearFecha(d)}</td>`;

    Object.values(grupos).forEach((lista) => {
      lista.forEach((h) => {
        const estado = h.estadoPorFecha[iso] || "";
        const clase = claseEstado(estado);
        const key = `${h.numeroHabitacion}-${iso}`;
        const seleccionada = estadoApp.habitacionesSeleccionadas.has(key) ? "cell-seleccionada" : "";
        
        // Solo permitir seleccionar si es DISPONIBLE o RESERVADA
        const seleccionable = (estado === "DISPONIBLE" || estado === "RESERVADA");
        
        // Guardar información adicional en data attributes
        let dataAttr = "";
        if (seleccionable) {
          dataAttr = `data-habitacion="${h.numeroHabitacion}" data-fecha="${iso}" data-estado="${estado}"`;
          
          // Si está reservada, agregar info de la reserva
          if (estado === "RESERVADA" && h.reservasPorFecha && h.reservasPorFecha[iso]) {
            const reserva = h.reservasPorFecha[iso];
            dataAttr += ` data-reserva-nombre="${reserva.nombre}" data-reserva-apellido="${reserva.apellido}" data-reserva-telefono="${reserva.telefono}"`;
          }
        }
        
        html += `<td class='cell-estado ${clase} ${seleccionada}' ${dataAttr} title='Hab. ${h.numeroHabitacion} - ${estado}'></td>`;
      });
    });

    html += "</tr>";
  });
  html += "</tbody>";
  html += "</table>";

  gridContainer.innerHTML = html;
  gridContainer.style.display = "block";
  legendContainer.style.display = "flex";
  instruccionesSeleccion.style.display = "block";

  // Agregar event listeners a las celdas seleccionables
  const celdas = gridContainer.querySelectorAll(".cell-estado[data-habitacion]");
  celdas.forEach((celda) => {
    celda.addEventListener("click", manejarClickCelda);
    celda.addEventListener("contextmenu", manejarClickDerechoCelda);
    celda.addEventListener("mouseenter", manejarHoverCelda);
  });

  actualizarBotonContinuar();
}

function manejarClickDerechoCelda(event) {
  event.preventDefault(); // Evitar menú contextual
  
  const celda = event.target;
  const habitacionId = celda.dataset.habitacion;
  const fecha = celda.dataset.fecha;
  const key = `${habitacionId}-${fecha}`;
  
  // Si está seleccionada, deseleccionar
  if (estadoApp.habitacionesSeleccionadas.has(key)) {
    estadoApp.habitacionesSeleccionadas.delete(key);
    celda.classList.remove("cell-seleccionada");
    actualizarBotonContinuar();
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
    estadoApp.seleccionRango.celdas = [celda];
    
    // Marcar visualmente como inicio de selección
    celda.style.border = "3px solid #fbbf24";
    
    // Mostrar botón de cancelar
    btnCancelarSeleccion.style.display = "inline-block";
  } else {
    // Si ya hay una selección activa y es de la misma habitación
    if (estadoApp.seleccionRango.habitacionId === habitacionId) {
      const fechaFin = fecha;
      const fechaIni = estadoApp.seleccionRango.fechaInicio;
      
      // Seleccionar todas las celdas en el rango
      seleccionarRangoCeldas(habitacionId, fechaIni, fechaFin, estado);
      
      // Resetear el estado de selección de rango
      estadoApp.seleccionRango.celdas.forEach(c => {
        if (c && c.style) c.style.border = "";
      });
      estadoApp.seleccionRango = {
        activo: false,
        habitacionId: null,
        fechaInicio: null,
        celdas: []
      };
      btnCancelarSeleccion.style.display = "none";
    } else {
      // Si es de otra habitación, cancelar la selección anterior y empezar nueva
      estadoApp.seleccionRango.celdas.forEach(c => {
        if (c && c.style) c.style.border = "";
      });
      estadoApp.seleccionRango.activo = true;
      estadoApp.seleccionRango.habitacionId = habitacionId;
      estadoApp.seleccionRango.fechaInicio = fecha;
      estadoApp.seleccionRango.celdas = [celda];
      celda.style.border = "3px solid #fbbf24";
      btnCancelarSeleccion.style.display = "inline-block";
    }
  }
  
  actualizarBotonContinuar();
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

function seleccionarRangoCeldas(habitacionId, fechaIni, fechaFin, estadoInicial) {
  // Determinar el orden correcto de las fechas
  const [f1, f2] = fechaIni <= fechaFin ? [fechaIni, fechaFin] : [fechaFin, fechaIni];
  
  // Verificar si hay reservas en el rango
  let hayReservada = false;
  const fechasReservadas = [];
  const todasCeldas = gridContainer.querySelectorAll(".cell-estado[data-habitacion]");
  const celdasEnRango = [];
  
  todasCeldas.forEach(celda => {
    if (celda.dataset.habitacion === habitacionId) {
      const f = celda.dataset.fecha;
      if (f >= f1 && f <= f2) {
        celdasEnRango.push(celda);
        if (celda.dataset.estado === "RESERVADA") {
          hayReservada = true;
          fechasReservadas.push(f);
        }
      }
    }
  });
  
  // Si hay alguna reservada, buscar información de la reserva y pedir confirmación
  if (hayReservada) {
    buscarInfoReservaYConfirmar(habitacionId, fechasReservadas, celdasEnRango);
    return; // La selección se hará en el callback de la confirmación
  }
  
  // Seleccionar todas las celdas del rango (función auxiliar)
  seleccionarCeldas(habitacionId, celdasEnRango);
}

function seleccionarCeldas(habitacionId, celdasEnRango) {
  celdasEnRango.forEach(celda => {
    const key = `${habitacionId}-${celda.dataset.fecha}`;
    if (!estadoApp.habitacionesSeleccionadas.has(key)) {
      estadoApp.habitacionesSeleccionadas.set(key, {
        habitacionId: habitacionId,
        fecha: celda.dataset.fecha,
        numeroHabitacion: habitacionId
      });
      celda.classList.add("cell-seleccionada");
    }
  });
  
  // Limpiar previews
  document.querySelectorAll(".cell-preview").forEach(c => {
    c.classList.remove("cell-preview");
  });
}

async function buscarInfoReservaYConfirmar(habitacionId, fechasReservadas, celdasEnRango) {
  // Buscar la información de la reserva desde los data attributes de las celdas
  try {
    let infoReservas = new Map(); // fecha -> info
    
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
    
    let mensaje = `⚠️ ADVERTENCIA: Esta habitación está RESERVADA\n\n`;
    mensaje += `Habitación: ${habitacionId}\n`;
    mensaje += `Fechas reservadas: ${fechasFormateadas}\n`;
    mensaje += `Cantidad de días: ${fechasReservadas.length}\n\n`;
    
    // Agregar información de las reservas si está disponible
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
    
    mensaje += `\n¿Desea OCUPAR IGUAL estas fechas?\n`;
    mensaje += `(Esto reemplazará la reserva existente)\n\n`;
    mensaje += `Presione ACEPTAR para OCUPAR IGUAL o CANCELAR para VOLVER`;
    
    const confirmar = confirm(mensaje);
    
    if (confirmar) {
      seleccionarCeldas(habitacionId, celdasEnRango);
    }
  } catch (error) {
    console.error("Error al buscar info de reserva:", error);
    
    // Si falla, mostrar diálogo básico
    const confirmar = confirm(
      `Esta habitación tiene fechas RESERVADAS.\n¿Desea ocuparlas de todas formas?`
    );
    
    if (confirmar) {
      seleccionarCeldas(habitacionId, celdasEnRango);
    }
  }
}



function actualizarBotonContinuar() {
  if (estadoApp.habitacionesSeleccionadas.size > 0) {
    btnContinuarContainer.style.display = "block";
  } else {
    btnContinuarContainer.style.display = "none";
  }
}

function continuarAPaso2() {
  if (estadoApp.habitacionesSeleccionadas.size === 0) {
    errorFechas.textContent = "Debe seleccionar al menos una habitación.";
    return;
  }

  // Obtener habitaciones únicas seleccionadas
  const habitacionesUnicas = new Set();
  estadoApp.habitacionesSeleccionadas.forEach((value) => {
    habitacionesUnicas.add(value.habitacionId);
  });

  if (habitacionesUnicas.size === 0) {
    errorFechas.textContent = "Error al procesar las habitaciones seleccionadas.";
    return;
  }

  paso1Card.style.display = "none";
  paso2Card.style.display = "block";
}

btnMostrarEstado.addEventListener("click", mostrarEstadoHabitaciones);

btnLimpiarFechas.addEventListener("click", () => {
  inputDesde.value = "";
  inputHasta.value = "";
  errorFechas.textContent = "";
  gridContainer.innerHTML = "";
  gridContainer.style.display = "none";
  legendContainer.style.display = "none";
  btnContinuarContainer.style.display = "none";
  instruccionesSeleccion.style.display = "none";
  btnCancelarSeleccion.style.display = "none";
  estadoApp.habitacionesSeleccionadas.clear();
  estadoApp.seleccionRango = {
    activo: false,
    habitacionId: null,
    fechaInicio: null,
    celdas: []
  };
  inputDesde.focus();
});

btnContinuar.addEventListener("click", continuarAPaso2);

// Botón para cancelar selección de rango
btnCancelarSeleccion.addEventListener("click", () => {
  // Limpiar bordes de las celdas
  estadoApp.seleccionRango.celdas.forEach(c => {
    if (c && c.style) c.style.border = "";
  });
  
  // Resetear estado de selección de rango
  estadoApp.seleccionRango = {
    activo: false,
    habitacionId: null,
    fechaInicio: null,
    celdas: []
  };
  
  // Ocultar botón
  btnCancelarSeleccion.style.display = "none";
  
  // Limpiar previews
  document.querySelectorAll(".cell-preview").forEach(c => {
    c.classList.remove("cell-preview");
  });
});

// ============================================================
// PASO 2: BUSCAR Y SELECCIONAR HUÉSPEDES
// ============================================================

async function buscarHuespedes() {
  errorBusqueda.textContent = "";

  const datos = {
    nombre: buscarNombre.value.trim(),
    apellido: buscarApellido.value.trim(),
    tipoDocumento: buscarTipoDoc.value,
    nroDocumento: buscarNumDoc.value.trim()
  };

  try {
    const response = await fetch("/api/huespedes/buscar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      errorBusqueda.textContent = "Error al buscar huéspedes.";
      return;
    }

    const data = await response.json();
    const lista = Array.isArray(data) ? data : (data.huespedes || []);

    mostrarResultados(lista);
  } catch (error) {
    console.error("Error:", error);
    errorBusqueda.textContent = "No se pudo conectar con el servidor.";
  }
}

function mostrarResultados(huespedes) {
  resultadosBusqueda.innerHTML = "";
  
  if (!Array.isArray(huespedes) || huespedes.length === 0) {
    resultadosBusqueda.innerHTML = "<p style='padding: 12px; color: #9ca3af;'>No se encontraron huéspedes.</p>";
    resultadosBusqueda.style.display = "block";
    return;
  }

  huespedes.forEach(h => {
    const item = document.createElement("div");
    item.classList.add("resultado-item");

    item.innerHTML = `
      <div class="resultado-info">
        <p><strong>Nombre:</strong> ${h.nombres || ""}</p>
        <p><strong>Apellido:</strong> ${h.apellido || ""}</p>
        <p><strong>Tipo Doc:</strong> ${h.tipoDocumento || ""}</p>
        <p><strong>Nro Doc:</strong> ${h.nroDocumento || ""}</p>
      </div>
    `;

    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "8px";

    // Botón para seleccionar como titular
    const btnTitular = document.createElement("button");
    btnTitular.textContent = "Titular";
    btnTitular.classList.add("btn-seleccionar");
    btnTitular.addEventListener("click", () => seleccionarTitular(h));

    // Botón para seleccionar como acompañante
    const btnAcomp = document.createElement("button");
    btnAcomp.textContent = "Acompañante";
    btnAcomp.classList.add("btn-seleccionar", "acompanante");
    btnAcomp.addEventListener("click", () => agregarAcompanante(h));

    btnContainer.appendChild(btnTitular);
    btnContainer.appendChild(btnAcomp);
    item.appendChild(btnContainer);

    resultadosBusqueda.appendChild(item);
  });

  resultadosBusqueda.style.display = "block";
}

function seleccionarTitular(huesped) {
  estadoApp.huespedTitular = huesped;
  titularInfo.textContent = `${huesped.nombres} ${huesped.apellido} (${huesped.tipoDocumento}: ${huesped.nroDocumento})`;
}

function agregarAcompanante(huesped) {
  // Verificar que no sea el titular
  if (estadoApp.huespedTitular && estadoApp.huespedTitular.id === huesped.id) {
    alert("El huésped titular no puede ser acompañante.");
    return;
  }

  // Verificar que no esté ya en la lista
  const yaExiste = estadoApp.acompanantes.some(a => a.id === huesped.id);
  if (yaExiste) {
    alert("Este huésped ya está en la lista de acompañantes.");
    return;
  }

  estadoApp.acompanantes.push(huesped);
  actualizarListaAcompanantes();
}

function actualizarListaAcompanantes() {
  listaAcompanantes.innerHTML = "";

  if (estadoApp.acompanantes.length === 0) {
    listaAcompanantes.innerHTML = "<span class='no-acompanantes'>Ninguno seleccionado</span>";
    return;
  }

  estadoApp.acompanantes.forEach((acomp, index) => {
    const item = document.createElement("div");
    item.classList.add("acompanante-item");

    item.innerHTML = `
      <span>${acomp.nombres} ${acomp.apellido} (${acomp.tipoDocumento}: ${acomp.nroDocumento})</span>
    `;

    const btnQuitar = document.createElement("button");
    btnQuitar.textContent = "Quitar";
    btnQuitar.classList.add("btn-quitar");
    btnQuitar.addEventListener("click", () => {
      estadoApp.acompanantes.splice(index, 1);
      actualizarListaAcompanantes();
    });

    item.appendChild(btnQuitar);
    listaAcompanantes.appendChild(item);
  });
}

async function confirmarOcupacion() {
  errorBusqueda.textContent = "";

  // Validar que haya un titular
  if (!estadoApp.huespedTitular) {
    errorBusqueda.textContent = "Debe seleccionar un huésped titular.";
    return;
  }

  // Obtener habitaciones únicas
  const habitacionesIds = [...new Set(
    Array.from(estadoApp.habitacionesSeleccionadas.values()).map(v => parseInt(v.habitacionId))
  )];

  const requestBody = {
    fechaInicio: estadoApp.fechaDesde,
    fechaFin: estadoApp.fechaHasta,
    idsHabitaciones: habitacionesIds,
    idHuespedTitular: estadoApp.huespedTitular.id,
    idsAcompanantes: estadoApp.acompanantes.map(a => a.id)
  };

  try {
    const response = await fetch("/api/habitaciones/ocupar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      let msg = "Error al ocupar las habitaciones.";
      try {
        const errJson = await response.json();
        if (errJson && errJson.detalle) msg = errJson.detalle;
      } catch (_) {}
      errorBusqueda.textContent = msg;
      return;
    }

    const data = await response.json();
    mostrarConfirmacion(data);
  } catch (error) {
    console.error("Error:", error);
    errorBusqueda.textContent = "No se pudo conectar con el servidor.";
  }
}

function mostrarConfirmacion(data) {
  paso2Card.style.display = "none";
  paso3Card.style.display = "block";

  mensajeConfirmacion.innerHTML = `
    <p><strong>¡Ocupación registrada exitosamente!</strong></p>
    <p>Reserva ID: ${data.idReserva}</p>
    <p>Titular: ${data.nombreTitular} ${data.apellidoTitular}</p>
    <p>Habitaciones: ${data.idsHabitaciones.join(", ")}</p>
    <p>Desde: ${convertirFechaAArgentina(data.fechaInicio)}</p>
    <p>Hasta: ${convertirFechaAArgentina(data.fechaFin)}</p>
    ${data.idsAcompanantes && data.idsAcompanantes.length > 0 ? 
      `<p>Acompañantes: ${data.idsAcompanantes.length}</p>` : ""}
  `;
}

btnBuscarHuesped.addEventListener("click", buscarHuespedes);
btnConfirmarOcupacion.addEventListener("click", confirmarOcupacion);

btnVolverPaso1.addEventListener("click", () => {
  paso2Card.style.display = "none";
  paso1Card.style.display = "block";
  
  // Limpiar búsqueda
  buscarNombre.value = "";
  buscarApellido.value = "";
  buscarTipoDoc.value = "";
  buscarNumDoc.value = "";
  resultadosBusqueda.innerHTML = "";
  resultadosBusqueda.style.display = "none";
  errorBusqueda.textContent = "";
});

// Botón "Seguir Cargando" - vuelve al paso 2 para cargar más huéspedes
const btnSeguirCargando = document.getElementById("btnSeguirCargando");
if (btnSeguirCargando) {
  btnSeguirCargando.addEventListener("click", () => {
    paso3Card.style.display = "none";
    paso2Card.style.display = "block";
    
    // Mantener las fechas y habitaciones, limpiar huéspedes
    estadoApp.huespedTitular = null;
    estadoApp.acompanantes = [];
    titularInfo.textContent = "No seleccionado";
    listaAcompanantes.innerHTML = "<span class='no-acompanantes'>Ninguno seleccionado</span>";
    
    // Limpiar búsqueda
    buscarNombre.value = "";
    buscarApellido.value = "";
    buscarTipoDoc.value = "";
    buscarNumDoc.value = "";
    resultadosBusqueda.innerHTML = "";
    resultadosBusqueda.style.display = "none";
    errorBusqueda.textContent = "";
  });
}

// Botón "Cargar Otra Habitación" - vuelve al paso 1 (mostrar estado)
const btnCargarOtraHabitacion = document.getElementById("btnCargarOtraHabitacion");
if (btnCargarOtraHabitacion) {
  btnCargarOtraHabitacion.addEventListener("click", () => {
    paso3Card.style.display = "none";
    paso1Card.style.display = "block";
    
    // Mantener las fechas pero limpiar selecciones
    gridContainer.innerHTML = "";
    gridContainer.style.display = "none";
    legendContainer.style.display = "none";
    btnContinuarContainer.style.display = "none";
    instruccionesSeleccion.style.display = "none";
    btnCancelarSeleccion.style.display = "none";
    
    estadoApp.habitacionesSeleccionadas.clear();
    estadoApp.huespedTitular = null;
    estadoApp.acompanantes = [];
    estadoApp.seleccionRango = {
      activo: false,
      habitacionId: null,
      fechaInicio: null,
      celdas: []
    };
    
    // Volver a mostrar el estado con las fechas actuales
    if (estadoApp.fechaDesde && estadoApp.fechaHasta) {
      mostrarEstadoHabitaciones();
    }
  });
}

// Botón "Salir" - vuelve a inicio
const btnSalir = document.getElementById("btnSalir");
if (btnSalir) {
  btnSalir.addEventListener("click", () => {
    window.location.href = "/inicio";
  });
}

// Botón Volver en Paso 1
const btnVolverInicioPaso1 = document.getElementById("btnVolverInicioPaso1");
if (btnVolverInicioPaso1) {
  btnVolverInicioPaso1.addEventListener("click", () => {
    window.history.back();
  });
}
