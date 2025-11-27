/**
 * importante!!!!!! el formato para el front es: dd/MM/yyyy
 * Backend recibe: yyyy-MM-dd (ISO 8601)
 */

/**
 * Convierte fecha del formato dd/mm/aaaa al formato ISO yyyy-mm-dd
 * @param {string} fechaStr - Fecha en formato dd/mm/aaaa
 * @returns {string|null} - Fecha en formato yyyy-mm-dd o null si es inválida
 */
function convertirFechaAISO(fechaStr) {
  //aca la idea es que se convierta la fecha al formato que entiende el backend osea yyyy-mm-dd
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = fechaStr.match(regex);
  if (!match) {
    return null;
  }
  const dia = match[1];
  const mes = match[2];
  const anio = match[3];
  return `${anio}-${mes}-${dia}`;
}

/**
 * Convierte fecha del formato ISO yyyy-mm-dd al formato dd/mm/aaaa
 * @param {string} fechaISO - Fecha en formato yyyy-mm-dd
 * @returns {string|null} - Fecha en formato dd/mm/aaaa o null si es inválida
 */
function convertirFechaAArgentina(fechaISO) {
  //aca pasa de yyyy-mm-dd a dd/mm/yyyy
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = fechaISO.match(regex);
  if (!match) {
    return null;
  }
  const anio = match[1];
  const mes = match[2];
  const dia = match[3];
  return `${dia}/${mes}/${anio}`;
}

/**
 * Valida que una fecha tenga el formato dd/mm/aaaa y sea una fecha válida
 * @param {string} fechaStr - Fecha en formato dd/mm/aaaa
 * @returns {boolean} - true si es válida, false si no
 */
function validarFecha(fechaStr) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(fechaStr)) {
    return false;
  }
  const [dia, mes, anio] = fechaStr.split("/").map(Number);

  if (mes < 1 || mes > 12) return false;
  if (dia < 1 || dia > 31) return false;
  if (anio < 1900 || anio > 2100) return false;

  const fecha = new Date(anio, mes - 1, dia);
  return (
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia
  );
}

/**
 * Formatea un objeto Date al formato dd/mm/aaaa
 * @param {Date} fecha - Objeto Date
 * @returns {string} - Fecha en formato dd/mm/aaaa
 */
function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

/**
 * Obtiene la fecha de hoy en formato dd/mm/aaaa
 * @returns {string} - Fecha de hoy en formato dd/mm/aaaa
 */
function obtenerFechaHoy() {
  return formatearFecha(new Date());
}

/**
 * Aplica máscara automática a un input de fecha mientras el usuario escribe
 * @param {HTMLInputElement} input - Input de texto para la fecha
 */
function aplicarMascaraFecha(input) {
  input.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Solo números

    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + "/" + value.slice(5, 9);
    }

    e.target.value = value;
  });

  // Validar al perder el foco
  input.addEventListener("blur", function (e) {
    const valor = e.target.value;
    if (valor && !validarFecha(valor)) {
      input.setCustomValidity("Fecha inválida. Use formato dd/mm/aaaa");
      input.reportValidity();
    } else {
      input.setCustomValidity("");
    }
  });
}
