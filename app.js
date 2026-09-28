// ====================================================================
// Evidencia SENA: GA7-220501096-AA5-EV01
// "Diseño y desarrollo de servicios web - caso"
// Grupo: 6 | Ficha: 3336134
// Archivo principal del servidor backend con Node.js, Express y MongoDB
// ====================================================================

// 1. Carga de variables de entorno desde el archivo .env
require('dotenv').config();

// 2. Importación del framework Express y la función de conexión a la base de datos
const express = require('express');
const path = require('path');
const conectarBD = require('./config/database');

// Importación de las rutas de autenticación
const authRoutes = require('./routes/authRoutes');

// 3. Inicialización de la aplicación Express
const app = express();

// 4. Definición del puerto de escucha (prioriza variable de entorno o puerto 3000 por defecto)
const puertoServidor = process.env.PORT || 3000;

// 5. Middleware para habilitar el procesamiento de solicitudes con formato JSON en el cuerpo
app.use(express.json());

// 6. Montaje de rutas de la API
app.use('/api/auth', authRoutes);

// 7. Servicio de archivos estáticos para la interfaz web cliente
// Sirve los archivos de la carpeta 'public' (GET / responde con index.html)
app.use(express.static(path.join(__dirname, 'public')));

// 8. Función asíncrona para iniciar la conexión con la base de datos y levantar el servidor
const iniciarServidor = async () => {
    try {
        // Intento de conexión con MongoDB mediante Mongoose
        await conectarBD();

        // Puesta en marcha del servidor HTTP
        app.listen(puertoServidor, () => {
            console.log(`Servidor corriendo en http://localhost:${puertoServidor}`);
        });
    } catch (error) {
        console.error('Error al inicializar el servidor:', error.message);
    }
};

// Ejecución del arranque del servidor
iniciarServidor();

module.exports = app;
