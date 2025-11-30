document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("datos-huesped");

    // Leer parámetros de la URL (query string)
    const params = new URLSearchParams(window.location.search);

    // Armar un objeto "huesped" con los campos del HuespedDTO
    const huesped = {
        id: params.get("id"),
        nombres: params.get("nombres"),
        apellido: params.get("apellido"),
        nroDocumento: params.get("nroDocumento"),
        posIVA: params.get("posIVA"),
        fechaDeNacimiento: params.get("fechaDeNacimiento"),
        telefono: params.get("telefono"),
        ocupacion: params.get("ocupacion"),
        nacionalidad: params.get("nacionalidad"),
        CUIT: params.get("CUIT"),
        email: params.get("email"),
        tipoDocumento: params.get("tipoDocumento"),
        codigoPostal: params.get("codigoPostal"),
        calle: params.get("calle"),
        nroCalle: params.get("nroCalle"),
        piso: params.get("piso"),
        nroDepartamento: params.get("nroDepartamento"),
        ciudad: params.get("ciudad"),
        localidad: params.get("localidad"),
        provincia: params.get("provincia"),
        pais: params.get("pais")
    };

    // Mostrar campo por campo
    contenedor.innerHTML = `
        <div class="campo">
            <span class="label">ID:</span> ${huesped.id ?? ""}
        </div>
        <div class="campo">
            <span class="label">Nombres:</span> ${huesped.nombres ?? ""}
        </div>
        <div class="campo">
            <span class="label">Apellido:</span> ${huesped.apellido ?? ""}
        </div>
        <div class="campo">
            <span class="label">Tipo documento:</span> ${huesped.tipoDocumento ?? ""}
        </div>
        <div class="campo">
            <span class="label">Número documento:</span> ${huesped.nroDocumento ?? ""}
        </div>
        <div class="campo">
            <span class="label">Posición IVA:</span> ${huesped.posIVA ?? ""}
        </div>
        <div class="campo">
            <span class="label">Fecha de nacimiento:</span> ${huesped.fechaDeNacimiento ?? ""}
        </div>
        <div class="campo">
            <span class="label">Teléfono:</span> ${huesped.telefono ?? ""}
        </div>
        <div class="campo">
            <span class="label">Ocupación:</span> ${huesped.ocupacion ?? ""}
        </div>
        <div class="campo">
            <span class="label">Nacionalidad:</span> ${huesped.nacionalidad ?? ""}
        </div>
        <div class="campo">
            <span class="label">CUIT:</span> ${huesped.CUIT ?? ""}
        </div>
        <div class="campo">
            <span class="label">Email:</span> ${huesped.email ?? ""}
        </div>
        <div class="campo">
            <span class="label">Calle:</span> ${huesped.calle ?? ""}
        </div>
        <div class="campo">
            <span class="label">Número calle:</span> ${huesped.nroCalle ?? ""}
        </div>
        <div class="campo">
            <span class="label">Piso:</span> ${huesped.piso ?? ""}
        </div>
        <div class="campo">
            <span class="label">Número departamento:</span> ${huesped.nroDepartamento ?? ""}
        </div>
        <div class="campo">
            <span class="label">Localidad:</span> ${huesped.localidad ?? ""}
        </div>
        <div class="campo">
            <span class="label">Provincia:</span> ${huesped.provincia ?? ""}
        </div>
        <div class="campo">
            <span class="label">País:</span> ${huesped.pais ?? ""}
        </div>
    `;
});
