// ====================================================================
// Evidencia SENA: GA7-220501096-AA5-EV01
// "Diseño y desarrollo de servicios web - caso"
// Grupo: 6 | Ficha: 3336134
// Módulo de configuración y conexión a MongoDB con Mongoose
// ====================================================================

const mongoose = require('mongoose');

/**
 * Función asíncrona encargada de conectar la aplicación con la base de datos MongoDB local.
 * Obtiene la cadena de conexión de forma segura desde la variable de entorno MONGODB_URI.
 * 
 * @returns {Promise<boolean>} Retorna true si la conexión fue exitosa, false si no se configuró la URI.
 */
const conectarBD = async () => {
    try {
        const uriConexion = process.env.MONGODB_URI;

        // Validación de existencia de la variable de entorno sin exponer credenciales
        if (!uriConexion) {
            console.warn('ADVERTENCIA: La variable de entorno MONGODB_URI no se encuentra definida en el archivo .env');
            return false;
        }

        // Establecimiento de la conexión con MongoDB mediante Mongoose
        await mongoose.connect(uriConexion);
        console.log('Conexión exitosa a la base de datos MongoDB');
        return true;
    } catch (error) {
        console.error('Error al conectar con la base de datos MongoDB:', error.message);
        throw error;
    }
};

module.exports = conectarBD;
