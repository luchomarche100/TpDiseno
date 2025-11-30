document.addEventListener("DOMContentLoaded", () => {
    // Leemos los parámetros de la URL ?id=...&nombres=... etc.
    const params = new URLSearchParams(window.location.search);
    const get = (nombre) => params.get(nombre) || "";

    // Rellenar campos del formulario
    const id = document.getElementById("id");
    if (id) id.value = get("id");

    const nombres = document.getElementById("nombres");
    if (nombres) nombres.value = get("nombres");

    const apellido = document.getElementById("apellido");
    if (apellido) apellido.value = get("apellido");

    const nroDocumento = document.getElementById("nroDocumento");
    if (nroDocumento) nroDocumento.value = get("nroDocumento");

    // POSICIÓN FRENTE AL IVA (select)
    const posIVASelect = document.getElementById("posIVA");
    if (posIVASelect) {
        const posIVAParam = get("posIVA"); // viene de la URL
        if (posIVAParam) {
            posIVASelect.value = posIVAParam;
        }
    }

    const fechaDeNacimiento = document.getElementById("fechaDeNacimiento");
    if (fechaDeNacimiento) fechaDeNacimiento.value = get("fechaDeNacimiento");

    const telefono = document.getElementById("telefono");
    if (telefono) telefono.value = get("telefono");

    const ocupacion = document.getElementById("ocupacion");
    if (ocupacion) ocupacion.value = get("ocupacion");

    const nacionalidad = document.getElementById("nacionalidad");
    if (nacionalidad) nacionalidad.value = get("nacionalidad");

    const cuit = document.getElementById("CUIT");
    if (cuit) cuit.value = get("CUIT");

    const email = document.getElementById("email");
    if (email) email.value = get("email");

    // TIPO DE DOCUMENTO (select con DNI, LE, LC, PASAPORTE, OTRO)
    const tipoDocumentoSelect = document.getElementById("tipoDocumento");
    if (tipoDocumentoSelect) {
        const tipoDocParam = get("tipoDocumento"); // viene de la URL
        if (tipoDocParam) {
            tipoDocumentoSelect.value = tipoDocParam;
        }
    }

    // (Opcional) aquí podes enganchar eventos de los botones si querés:
    // const btnCancelar = document.getElementById("btn-cancelar");
    // const btnBorrar = document.getElementById("btn-borrar");
    // const btnGuardar = document.getElementById("btn-guardar");
});
