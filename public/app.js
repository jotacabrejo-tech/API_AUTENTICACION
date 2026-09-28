// ====================================================================
// Evidencia SENA: GA7-220501096-AA5-EV01
// "Diseño y desarrollo de servicios web - caso"
// Grupo: 6 | Ficha: 3336134
// Cliente JavaScript Vanilla para consumo de la API REST de Autenticación
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a Vistas del DOM ---
    const viewLogin = document.getElementById('view-login');
    const viewRegister = document.getElementById('view-register');
    const viewDashboard = document.getElementById('view-dashboard');
    const alertContainer = document.getElementById('alert-container');

    // --- Formularios y Botones de Envío ---
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const btnSubmitLogin = document.getElementById('btn-submit-login');
    const btnSubmitRegister = document.getElementById('btn-submit-register');

    // --- Botones de Navegación entre Vistas ---
    const btnGoToRegister = document.getElementById('btn-go-to-register');
    const btnGoToLogin = document.getElementById('btn-go-to-login');
    const btnLogout = document.getElementById('btn-logout');

    // --- Campos de Entrada ---
    const loginUsuario = document.getElementById('login-usuario');
    const loginContrasena = document.getElementById('login-contrasena');
    const regUsuario = document.getElementById('reg-usuario');
    const regContrasena = document.getElementById('reg-contrasena');
    const regConfirmarContrasena = document.getElementById('reg-confirmar-contrasena');
    const sessionUsernameDisplay = document.getElementById('session-username-display');

    // --- Botones de Visualización de Contraseña ---
    const togglePwdButtons = document.querySelectorAll('.btn-toggle-pwd');

    /**
     * Muestra una notificación visual en la interfaz.
     * @param {string} mensaje - Mensaje a mostrar al usuario
     * @param {'success'|'error'|'info'} tipo - Estilo de la alerta
     */
    const mostrarAlerta = (mensaje, tipo = 'info') => {
        const iconos = {
            success: '✓',
            error: '✕',
            info: 'ℹ'
        };

        alertContainer.innerHTML = `
            <div class="alert alert-${tipo}" role="alert">
                <span class="alert-icon" aria-hidden="true">${iconos[tipo] || 'ℹ'}</span>
                <div class="alert-content">${escapeHTML(mensaje)}</div>
            </div>
        `;
    };

    /**
     * Limpia la alerta activa en pantalla.
     */
    const limpiarAlerta = () => {
        alertContainer.innerHTML = '';
    };

    /**
     * Sanitiza cadenas para prevenir inyecciones HTML en mensajes.
     * @param {string} texto 
     * @returns {string}
     */
    const escapeHTML = (texto) => {
        if (typeof texto !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    };

    /**
     * Conmuta entre las diferentes vistas sin recargar la página.
     * @param {'login'|'register'|'dashboard'} vista 
     */
    const cambiarVista = (vista) => {
        viewLogin.classList.remove('active');
        viewRegister.classList.remove('active');
        viewDashboard.classList.remove('active');

        if (vista === 'login') {
            viewLogin.classList.add('active');
            loginUsuario.focus();
        } else if (vista === 'register') {
            viewRegister.classList.add('active');
            regUsuario.focus();
        } else if (vista === 'dashboard') {
            viewDashboard.classList.add('active');
        }
    };

    /**
     * Activa o desactiva el estado de carga visual de un botón.
     * @param {HTMLButtonElement} boton 
     * @param {boolean} cargando 
     */
    const alternarCargaBoton = (boton, cargando) => {
        if (cargando) {
            boton.disabled = true;
            boton.classList.add('is-loading');
        } else {
            boton.disabled = false;
            boton.classList.remove('is-loading');
        }
    };

    // --- Configuración de conmutación de visibilidad de contraseñas ---
    togglePwdButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const inputTarget = document.getElementById(targetId);
            if (!inputTarget) return;

            if (inputTarget.type === 'password') {
                inputTarget.type = 'text';
                btn.textContent = '🙈';
                btn.setAttribute('aria-label', 'Ocultar contraseña');
            } else {
                inputTarget.type = 'password';
                btn.textContent = '👁️';
                btn.setAttribute('aria-label', 'Mostrar contraseña');
            }
        });
    });

    // --- Navegación entre Login y Registro ---
    btnGoToRegister.addEventListener('click', () => {
        limpiarAlerta();
        formLogin.reset();
        cambiarVista('register');
    });

    btnGoToLogin.addEventListener('click', () => {
        limpiarAlerta();
        formRegister.reset();
        cambiarVista('login');
    });

    btnLogout.addEventListener('click', () => {
        sessionUsernameDisplay.textContent = '---';
        loginContrasena.value = '';
        limpiarAlerta();
        mostrarAlerta('Sesión cerrada correctamente.', 'info');
        cambiarVista('login');
    });

    // =================================================================
    // GESTIÓN DEL FORMULARIO DE INICIO DE SESIÓN (LOGIN)
    // =================================================================
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        limpiarAlerta();

        const usuario = loginUsuario.value.trim();
        const contrasena = loginContrasena.value;

        // 1. Validaciones en el cliente: Campos requeridos no vacíos
        if (!usuario || !contrasena || contrasena.trim() === '') {
            mostrarAlerta('Error de validación: los campos usuario y contrasena son obligatorios', 'error');
            return;
        }

        // 2. Ejecución de la solicitud HTTP a la API REST
        alternarCargaBoton(btnSubmitLogin, true);

        try {
            const respuesta = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: usuario,
                    contrasena: contrasena
                })
            });

            const datos = await respuesta.json();

            // 3. Procesamiento de los diferentes códigos de estado HTTP
            if (respuesta.status === 200) {
                // Autenticación satisfactoria
                mostrarAlerta('Autenticación exitosa: las credenciales son correctas', 'success');
                const nombreAutenticado = (datos.datos && datos.datos.usuario) ? datos.datos.usuario : usuario;
                sessionUsernameDisplay.textContent = nombreAutenticado;
                
                // Limpieza de contraseña del formulario por seguridad
                loginContrasena.value = '';
                
                // Transición a la vista del panel/sesión
                cambiarVista('dashboard');
            } else if (respuesta.status === 401) {
                // Credenciales incorrectas
                mostrarAlerta('Credenciales inválidas: el usuario o la contraseña son incorrectos', 'error');
            } else if (respuesta.status === 400) {
                // Error de validación proveniente de la API
                mostrarAlerta(datos.mensaje || 'Error de validación en la solicitud.', 'error');
            } else {
                // Otros códigos de error (ej: 500)
                mostrarAlerta(datos.mensaje || 'Ocurrió un error inesperado al iniciar sesión.', 'error');
            }
        } catch (error) {
            // Manejo de errores de conectividad o red
            console.error('Error de conexión en login:', error);
            mostrarAlerta('Error de conexión: no fue posible comunicarse con el servidor. Verifique que la API esté activa.', 'error');
        } finally {
            alternarCargaBoton(btnSubmitLogin, false);
        }
    });

    // =================================================================
    // GESTIÓN DEL FORMULARIO DE REGISTRO
    // =================================================================
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        limpiarAlerta();

        const usuario = regUsuario.value.trim();
        const contrasena = regContrasena.value;
        const confirmarContrasena = regConfirmarContrasena.value;

        // 1. Validaciones en el cliente
        if (!usuario || !contrasena || contrasena.trim() === '') {
            mostrarAlerta('Error de validación: los campos usuario y contrasena no pueden estar vacíos', 'error');
            return;
        }

        if (!confirmarContrasena || confirmarContrasena.trim() === '') {
            mostrarAlerta('Por favor confirma la contraseña.', 'error');
            return;
        }

        // 2. Validación de coincidencia de contraseñas
        if (contrasena !== confirmarContrasena) {
            mostrarAlerta('Las contraseñas no coinciden.', 'error');
            return;
        }

        // 3. Envío de datos al endpoint de registro
        alternarCargaBoton(btnSubmitRegister, true);

        try {
            const respuesta = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: usuario,
                    contrasena: contrasena
                })
            });

            const datos = await respuesta.json();

            // 4. Procesamiento de respuestas según código de estado HTTP
            if (respuesta.status === 201) {
                // Registro exitoso
                mostrarAlerta('Usuario registrado correctamente', 'success');
                
                // Precarga del usuario en el formulario de login y limpieza de campos de registro
                const usuarioRegistrado = (datos.datos && datos.datos.usuario) ? datos.datos.usuario : usuario;
                loginUsuario.value = usuarioRegistrado;
                loginContrasena.value = '';
                formRegister.reset();

                // Permitir volver al formulario de login automáticamente
                cambiarVista('login');
                loginContrasena.focus();
            } else if (respuesta.status === 409) {
                // Conflicto: Usuario ya existente
                mostrarAlerta('El usuario ya se encuentra registrado.', 'error');
            } else if (respuesta.status === 400) {
                // Error de validación retornado por la API
                mostrarAlerta(datos.mensaje || 'Error de validación recibido desde la API.', 'error');
            } else {
                // Error inesperado del servidor
                mostrarAlerta(datos.mensaje || 'Error al procesar el registro de usuario.', 'error');
            }
        } catch (error) {
            // Manejo de fallas de red
            console.error('Error de conexión en registro:', error);
            mostrarAlerta('Error de conexión: no fue posible comunicarse con el servidor. Verifique que la API esté activa.', 'error');
        } finally {
            alternarCargaBoton(btnSubmitRegister, false);
        }
    });
});
