document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("form-buscar-huesped");
    const divResultados = document.getElementById("resultados");

    // 🔵 Al cargar la página, aseguramos que esté oculto
    divResultados.style.display = "none";

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

            // 🔵 A PARTIR DE AQUÍ MOSTRAMOS EL RECTÁNGULO
            divResultados.style.display = "inline-block";

            if (!Array.isArray(lista) || lista.length === 0) {
                divResultados.innerHTML = "<p>No se encontraron huéspedes.</p>";
                return;
            }

            // Dibujar cada huésped
            lista.forEach(h => {
                const tarjeta = document.createElement("div");
                tarjeta.classList.add("resultado-item"); // Nueva clase

                tarjeta.innerHTML = `
                    <div class="resultado-info">
                        <p><strong>Nombre:</strong> ${h.nombres ?? ""}</p>
                        <p><strong>Apellido:</strong> ${h.apellido ?? ""}</p>
                        <p><strong>Tipo Doc:</strong> ${h.tipoDocumento ?? ""}</p>
                        <p><strong>Nro Doc:</strong> ${h.nroDocumento ?? ""}</p>
                    </div>
                `;


                // 🔵 Botón "Modificar" que REDIRIGE con todos los datos por query string
                const botonModificar = document.createElement("button");
                botonModificar.type = "button";
                botonModificar.textContent = "Modificar";
                botonModificar.classList.add("btn-modificar");


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
