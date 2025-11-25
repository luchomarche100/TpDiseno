const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // --- VALIDACIÓN LOCAL: Contraseñas Coinciden ---
    if (password !== confirmPassword) {
        alert('Error: Las contraseñas no coinciden.');
        return;
    }

    const credentials = {
        username: username,
        password: password,
        rol: 'HUESPED' // Asignar un rol por defecto
    };

    try {
        const response = await fetch('http://localhost:8080/api/register', { // <-- Endpoint de registro
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            window.location.href = '/login'; // Redirigir a la página de login
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido.' }));
            alert(`Fallo en el registro: ${errorData.message || 'El usuario ya existe o hay un error en el servidor.'}`);
        }

    } catch (err) {
        alert('No se pudo conectar con el servidor.');
    }
});