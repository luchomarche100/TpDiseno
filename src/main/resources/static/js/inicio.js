document.addEventListener("DOMContentLoaded", () => {

    const irA = (idBoton, urlDestino) => {
        const btn = document.getElementById(idBoton);
        if (btn) {
            btn.addEventListener("click", () => {
                window.location.href = urlDestino;
            });
        }
    };

    irA("btn-alta-huesped", "/huespedes/alta");
    irA("btn-buscar-huesped", "/huespedes/buscar");
    irA("btn-estado-habitaciones", "/habitaciones/estado");
    irA("btn-reservar-habitaciones", "/habitaciones/reservar");
    irA("btn-ocupar-habitaciones", "/habitaciones/ocupar");
});
