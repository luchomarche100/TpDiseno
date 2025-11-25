document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("form-buscar-huesped");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // evita recargar la página

        // Obtener valores del formulario
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const tipoDocumento = document.getElementById("tipo-doc").value;
        const numeroDocumento = document.getElementById("numero-doc").value.trim();

        // Crear objeto para enviar
        const datos = {
            nombre: nombre,
            apellido: apellido,
            tipoDocumento: tipoDocumento,
            numeroDocumento: numeroDocumento
        };

        try {
            const response = await fetch("http://localhost:8080/api/huespedes/buscar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                throw new Error("Error en la búsqueda");
            }

            const resultado = await response.json();
            console.log("Resultado:", resultado);

            alert("Búsqueda realizada. Revise la consola para ver el resultado.");

        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al comunicarse con el servidor.");
        }
    });
});
