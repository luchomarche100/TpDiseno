const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
     
    // 2. Recopila las credenciales del formulario
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const credentials = {
        username: username,
        password: password
    };

    try {
        // 3. Envía la petición POST al LoginController
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        // 4. Maneja la respuesta del servidor
        if (response.ok) {
            alert('¡Bienvenido! Iniciaste sesión correctamente.');
            
            // 👉 Ahora va a la pantalla principal
            window.location.href = '/inicio';
        }
         else if (response.status === 401) {
            // CÓDIGO 401 UNAUTHORIZED: Credenciales Inválidas
            alert('Error: Credenciales inválidas. Usuario o contraseña incorrectos.');
            
        } else if (response.status === 400) {
            // CÓDIGO 400 BAD REQUEST: Error de validación (ej: campos vacíos)
            const errorData = await response.json();
            alert('Error de validación: ' + JSON.stringify(errorData));
            
        } else {
            // Otros errores del servidor (500 Internal Server Error, etc.)
            alert('Ocurrió un error inesperado en el servidor.');
        }

    } catch (err) {
        // Error de red (No se pudo conectar con el servidor)
        console.error('Error de conexión:', err);
        alert('No se pudo conectar con el servidor. Verifica que esté activo.');
    }
});