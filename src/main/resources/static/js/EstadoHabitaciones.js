const inputDesde = document.getElementById("fechaDesde");
const inputHasta = document.getElementById("fechaHasta");
const btnBuscar = document.getElementById("btnBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");
const errorDiv = document.getElementById("error");
const gridContainer = document.getElementById("gridContainer");

// Aplicar máscaras de fecha
aplicarMascaraFecha(inputDesde);
aplicarMascaraFecha(inputHasta);

// Utilidad: generar array de fechas entre dos fechas (string yyyy-mm-dd)
function generarFechas(desdeStr, hastaStr) {
  const fechas = [];
  // Parsear las fechas correctamente en zona horaria local
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
  // ordenar por numero dentro de cada grupo
  Object.values(grupos).forEach((lista) => {
    lista.sort((a, b) => a.numeroHabitacion - b.numeroHabitacion);
  });
  return grupos;
}

function validarFechas() {
  errorDiv.textContent = "";

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

  // Validar formato dd/mm/aaaa
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

  // Convertir a Date para comparar
  const [diaD, mesD, anioD] = inputDesde.value.split("/").map(Number);
  const [diaH, mesH, anioH] = inputHasta.value.split("/").map(Number);
  const dDesde = new Date(anioD, mesD - 1, diaD);
  const dHasta = new Date(anioH, mesH - 1, diaH);

  if (dDesde > dHasta) {
    errorDiv.textContent =
      "La fecha Desde no puede ser posterior a la fecha Hasta.";
    inputDesde.focus();
    return false;
  }

  return true;
}

async function buscarEstadoHabitaciones() {
  if (!validarFechas()) return;

  const requestBody = {
    fechaDesde: convertirFechaAISO(inputDesde.value), // formato yyyy-mm-dd
    fechaHasta: convertirFechaAISO(inputHasta.value),
  };

  try {
    const resp = await fetch("/api/habitaciones/estado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!resp.ok) {
      // intento leer error del backend (ReglaNegocioException)
      let msg = "Error al consultar el estado de las habitaciones.";
      try {
        const errJson = await resp.json();
        if (errJson && errJson.detalle) msg = errJson.detalle;
      } catch (_) {}
      errorDiv.textContent = msg;
      return;
    }

    const data = await resp.json();
    renderGrid(data);
  } catch (e) {
    console.error(e);
    errorDiv.textContent = "No se pudo conectar con el servidor.";
  }
}

function renderGrid(data) {
  const habitaciones = data.habitaciones || [];
  if (habitaciones.length === 0) {
    gridContainer.innerHTML =
      "<p style='padding: 12px;'>No hay habitaciones para el rango seleccionado.</p>";
    return;
  }

  const fechas = generarFechas(data.fechaDesde, data.fechaHasta);

  // Pre-calcular mapa fecha → estado para cada habitación
  habitaciones.forEach((h) => {
    h.estadoPorFecha = {};
    (h.estadosPorDia || []).forEach((ed) => {
      h.estadoPorFecha[ed.fecha] = ed.estado;
    });
  });

  const grupos = agruparPorTipo(habitaciones);

  // Construcción de la tabla
  let html = "<table class='estado-grid'>";

  // --------- Primera fila: tipos de habitación agrupados ----------
  html += "<thead>";
  html += "<tr>";

  // celda vacía en esquina izquierda
  html += "<th class='tipo-header fecha-header'></th>";

  Object.entries(grupos).forEach(([tipo, lista]) => {
    html += `<th class='tipo-header' colspan='${
      lista.length
    }'>${tipo.replaceAll("_", " ")}</th>`;
  });

  html += "</tr>";

  // --------- Segunda fila: números de habitación ----------
  html += "<tr>";
  html += "<th class='fecha-header'>Fechas</th>";
  Object.values(grupos).forEach((lista) => {
    lista.forEach((h) => {
      html += `<th>${h.numeroHabitacion}</th>`;
    });
  });
  html += "</tr>";
  html += "</thead>";

  // --------- Cuerpo: una fila por fecha ----------
  html += "<tbody>";
  fechas.forEach((d) => {
    const iso = d.toISOString().substring(0, 10); // yyyy-mm-dd

    html += "<tr>";
    html += `<td class='fecha-col'>${formatearFecha(d)}</td>`;

    Object.values(grupos).forEach((lista) => {
      lista.forEach((h) => {
        const estado = h.estadoPorFecha[iso] || ""; // por si falta
        const clase = claseEstado(estado);
        html += `<td class='cell-estado ${clase}' title='Hab. ${h.numeroHabitacion} - ${estado}'></td>`;
      });
    });

    html += "</tr>";
  });
  html += "</tbody>";

  html += "</table>";

  gridContainer.innerHTML = html;
}

btnBuscar.addEventListener("click", buscarEstadoHabitaciones);

btnLimpiar.addEventListener("click", () => {
  inputDesde.value = "";
  inputHasta.value = "";
  errorDiv.textContent = "";
  gridContainer.innerHTML = "";
  inputDesde.focus();
});

const btnVolver = document.getElementById("btnVolver");
if (btnVolver) {
  btnVolver.addEventListener("click", () => {
    window.history.back();
  });
}
