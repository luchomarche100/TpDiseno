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
            lista.forEach(h => {
                const tarjeta = `
                    <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
                        <p><strong>Nombre:</strong> ${h.nombres ?? ""}</p>
                        <p><strong>Apellido:</strong> ${h.apellido ?? ""}</p>
                        <p><strong>Tipo Doc:</strong> ${h.tipoDocumento ?? ""}</p>
                        <p><strong>Nro Doc:</strong> ${h.nroDocumento ?? ""}</p>
                    </div>
                `;
                divResultados.innerHTML += tarjeta;
            });

        } catch (error) {
            console.error("Error en fetch / parseo:", error);
            alert("Ocurrió un error al comunicarse con el servidor (ver consola).");
        }
    });
});
