document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("form-buscar-huesped");
    const divResultados = document.getElementById("resultados");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // evita recargar la página

        // Obtener valores del formulario
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const tipoDocumento = document.getElementById("tipo-doc").value;
        const numeroDocumento = document.getElementById("numero-doc").value.trim();

        const datos = {
            nombre: nombre,
            apellido: apellido,
            tipoDocumento: tipoDocumento,
            numeroDocumento: numeroDocumento
        };

        console.log("Enviando al backend:", datos);

        try {
            const response = await fetch("http://localhost:8080/api/huespedes/buscar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                const txt = await response.text();
                console.error("Respuesta NO OK:", response.status, txt);
                alert("Error en la búsqueda. Código: " + response.status);
                return;
            }

            // 👇 Ahora leemos el JSON completo
            const data = await response.json();
            console.log("JSON recibido:", data);

            // 👇 Sacamos la lista desde data.huespedes
            const lista = Array.isArray(data) ? data : (data.huespedes || []);

            // Limpiar resultados anteriores
            divResultados.innerHTML = "";

            if (!Array.isArray(lista) || lista.length === 0) {
                divResultados.innerHTML = "<p>No se encontraron huéspedes.</p>";
                return;
            }

            // Dibujar cada huésped
            divResultados.innerHTML = ""; // limpiar resultados anteriores

            lista.forEach(h => {
                const tarjeta = document.createElement("div");
                tarjeta.style.border = "1px solid #ccc";
                tarjeta.style.padding = "10px";
                tarjeta.style.margin = "10px 0";

                tarjeta.innerHTML = `
                    <p><strong>Nombre:</strong> ${h.nombres ?? ""}</p>
                    <p><strong>Apellido:</strong> ${h.apellido ?? ""}</p>
                    <p><strong>Tipo Doc:</strong> ${h.tipoDocumento ?? ""}</p>
                    <p><strong>Nro Doc:</strong> ${h.nroDocumento ?? ""}</p>
                `;

                // 🔵 Botón "Modificar" que REDIRIGE con todos los datos por query string
                const botonModificar = document.createElement("button");
                botonModificar.type = "button";
                botonModificar.textContent = "Modificar";

                botonModificar.addEventListener("click", () => {
                    const params = new URLSearchParams({
                        id: h.id ?? "",
                        nombres: h.nombres ?? "",
                        apellido: h.apellido ?? "",
                        nroDocumento: h.nroDocumento ?? "",
                        posIVA: h.posIVA ?? "",
                        fechaDeNacimiento: h.fechaDeNacimiento ?? "",
                        telefono: h.telefono ?? "",
                        ocupacion: h.ocupacion ?? "",
                        nacionalidad: h.nacionalidad ?? "",
                        CUIT: h.CUIT ?? h.cuit ?? "",
                        email: h.email ?? "",
                        tipoDocumento: h.tipoDocumento ?? "",
                        codigoPostal: h.direccion?.codigoPostal ?? "",
                        calle: h.direccion?.calle ?? "",
                        nroCalle: h.direccion?.nroCalle ?? "",
                        piso: h.direccion?.piso ?? "",
                        nroDepartamento: h.direccion?.nroDepartamento ?? "",
                        localidad: h.direccion?.localidad ?? "",
                        provincia: h.direccion?.provincia ?? "",
                        pais: h.direccion?.pais ?? ""
                    });

                    // 👉 Va al GET del ViewController: /huespedes/modificar
                    window.location.href = "/huespedes/modificar?" + params.toString();
                });

                tarjeta.appendChild(botonModificar);
                divResultados.appendChild(tarjeta);
            });

        } catch (error) {
            console.error("Error en fetch / parseo:", error);
            alert("Ocurrió un error al comunicarse con el servidor (ver consola).");
        }
    });
});
