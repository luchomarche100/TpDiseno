document.addEventListener("DOMContentLoaded", () => {
    // Leemos los parámetros de la URL ?id=...&nombres=... etc.
    const params = new URLSearchParams(window.location.search);
    const get = (nombre) => params.get(nombre) || "";

    // --------- RELLENAR CAMPOS BÁSICOS ---------
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
        const posIVAParam = get("posIVA");
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

    // --------- RELLENAR DIRECCIÓN (si viene por URL) ---------
    const codigoPostal = document.getElementById("codigoPostal");
    if (codigoPostal) codigoPostal.value = get("codigoPostal");

    const calle = document.getElementById("calle");
    if (calle) calle.value = get("calle");

    const nroCalle = document.getElementById("nroCalle");
    if (nroCalle) nroCalle.value = get("nroCalle");

    const piso = document.getElementById("piso");
    if (piso) piso.value = get("piso");

    const nroDepartamento = document.getElementById("nroDepartamento");
    if (nroDepartamento) nroDepartamento.value = get("nroDepartamento");

    const localidad = document.getElementById("localidad");
    if (localidad) localidad.value = get("localidad");

    const provincia = document.getElementById("provincia");
    if (provincia) provincia.value = get("provincia");

    const pais = document.getElementById("pais");
    if (pais) pais.value = get("pais");

    // TIPO DE DOCUMENTO (select con DNI, LE, LC, PASAPORTE, OTRO)
    const tipoDocumentoSelect = document.getElementById("tipoDocumento");
    if (tipoDocumentoSelect) {
        const tipoDocParam = get("tipoDocumento");
        if (tipoDocParam) {
            tipoDocumentoSelect.value = tipoDocParam;
        }
    }

    // --- ENVÍO DEL FORMULARIO AL PRESIONAR GUARDAR ---
    document
        .getElementById("form-modificar-huesped")
        .addEventListener("submit", async (event) => {
            event.preventDefault(); // Evita recargar la página

            // Helper para números opcionales
            const getIntOrNull = (id) => {
                const el = document.getElementById(id);
                if (!el) return null;
                const v = el.value.trim();
                return v === "" ? null : parseInt(v, 10);
            };

            // Armamos el objeto DireccionDTO
            const direccion = {
                codigoPostal: getIntOrNull("codigoPostal"),
                calle: document.getElementById("calle").value,
                nroCalle: getIntOrNull("nroCalle"),
                piso: getIntOrNull("piso"),
                nroDepartamento: document.getElementById("nroDepartamento").value,
                localidad: document.getElementById("localidad").value,
                provincia: document.getElementById("provincia").value,
                pais: document.getElementById("pais").value
            };

            // Armar el JSON tal como lo recibe el backend (HuespedDTO)
            const huespedDTO = {
                id: document.getElementById("id").value,
                nombres: document.getElementById("nombres").value,
                apellido: document.getElementById("apellido").value,
                tipoDocumento: document.getElementById("tipoDocumento").value,
                nroDocumento: document.getElementById("nroDocumento").value,
                posIVA: document.getElementById("posIVA").value,
                fechaDeNacimiento: document.getElementById("fechaDeNacimiento").value,
                telefono: document.getElementById("telefono").value,
                ocupacion: document.getElementById("ocupacion").value,
                direccion: direccion,              // 👈 NUEVO
                nacionalidad: document.getElementById("nacionalidad").value,
                CUIT: document.getElementById("CUIT").value, // 👈 nombre igual al field del DTO
                email: document.getElementById("email").value
            };

            console.log(
                "Enviando DTO al backend:",
                JSON.stringify(huespedDTO, null, 2)
            );

            try {
                const response = await fetch("/api/huespedes/modificar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(huespedDTO)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error en respuesta:", errorText);
                    alert("Error al modificar el huésped. Revise los datos.");
                    return;
                }

                const result = await response.json();
                alert("Huésped modificado correctamente.");

                // Redirección opcional:
                // window.location.href = "/buscarHuesped";

            } catch (error) {
                console.error(error);
                alert("Ocurrió un error al comunicarse con el servidor.");
            }
        });

    // --- BOTÓN CANCELAR: VOLVER A LA PANTALLA ANTERIOR ---
    const btnCancelar = document.getElementById("btn-cancelar");
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            const confirmar = confirm("¿Desea cancelar la modificación del huésped?");
            if (confirmar) {
                window.history.back();
            }
        });
    }
});
