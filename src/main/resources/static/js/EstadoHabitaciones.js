const inputDesde = document.getElementById("fechaDesde");
const inputHasta = document.getElementById("fechaHasta");
const btnBuscar = document.getElementById("btnBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");
const errorDiv = document.getElementById("error");
const gridContainer = document.getElementById("gridContainer");

// Utilidad: generar array de fechas entre dos fechas (string yyyy-mm-dd)
function generarFechas(desdeStr, hastaStr) {
  const fechas = [];
  // Parsear las fechas correctamente en zona horaria local
  const [yDesde, mDesde, dDesde] = desdeStr.split('-').map(Number);
  const [yHasta, mHasta, dHasta] = hastaStr.split('-').map(Number);
  
  let actual = new Date(yDesde, mDesde - 1, dDesde);
  const hasta = new Date(yHasta, mHasta - 1, dHasta);

  while (actual <= hasta) {
    fechas.push(new Date(actual));
    actual.setDate(actual.getDate() + 1);
  }
  return fechas;
}

// Formatea fecha a dd/mm/aaaa
function formatearFecha(d) {
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

// Convierte estado string → clase de color
function claseEstado(estado) {
  switch (estado) {
    case "DISPONIBLE": return "cell-disponible";
    case "OCUPADA": return "cell-ocupada";
    case "RESERVADA": return "cell-reservada";
    case "MANTENIMIENTO": return "cell-mantenimiento";
    default: return "";
  }
}

// Agrupa habitaciones por tipo
function agruparPorTipo(habitaciones) {
  const grupos = {};
  habitaciones.forEach(h => {
    const tipo = h.tipoHabitacion;
    if (!grupos[tipo]) grupos[tipo] = [];
    grupos[tipo].push(h);
  });
  // ordenar por numero dentro de cada grupo
  Object.values(grupos).forEach(lista => {
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

  const dDesde = new Date(inputDesde.value);
  const dHasta = new Date(inputHasta.value);

  if (isNaN(dDesde.getTime())) {
    errorDiv.textContent = "La fecha Desde tiene un formato inválido.";
    inputDesde.focus();
    return false;
  }
  if (isNaN(dHasta.getTime())) {
    errorDiv.textContent = "La fecha Hasta tiene un formato inválido.";
    inputHasta.focus();
    return false;
  }
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
    fechaDesde: inputDesde.value, // formato yyyy-mm-dd
    fechaHasta: inputHasta.value
  };

  try {
    const resp = await fetch("/api/habitaciones/estado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
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
    gridContainer.innerHTML = "<p style='padding: 12px;'>No hay habitaciones para el rango seleccionado.</p>";
    return;
  }

  const fechas = generarFechas(data.fechaDesde, data.fechaHasta);

  // Pre-calcular mapa fecha → estado para cada habitación
  habitaciones.forEach(h => {
    h.estadoPorFecha = {};
    (h.estadosPorDia || []).forEach(ed => {
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
    html += `<th class='tipo-header' colspan='${lista.length}'>${tipo.replaceAll("_", " ")}</th>`;
  });

  html += "</tr>";

  // --------- Segunda fila: números de habitación ----------
  html += "<tr>";
  html += "<th class='fecha-header'>Fechas</th>";
  Object.values(grupos).forEach(lista => {
    lista.forEach(h => {
      html += `<th>${h.numeroHabitacion}</th>`;
    });
  });
  html += "</tr>";
  html += "</thead>";

  // --------- Cuerpo: una fila por fecha ----------
  html += "<tbody>";
  fechas.forEach(d => {
    const iso = d.toISOString().substring(0, 10); // yyyy-mm-dd

    html += "<tr>";
    html += `<td class='fecha-col'>${formatearFecha(d)}</td>`;

    Object.values(grupos).forEach(lista => {
      lista.forEach(h => {
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
