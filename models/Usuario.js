// ====================================================================
// Evidencia SENA: GA7-220501096-AA5-EV01
// "Diseño y desarrollo de servicios web - caso"
// Grupo: 6 | Ficha: 3336134
// Modelo de datos para la entidad Usuario utilizando Mongoose
// ====================================================================

const mongoose = require('mongoose');

/**
 * Esquema de datos para la colección de usuarios.
 * Define la estructura, tipos de datos, restricciones y marcas de tiempo
 * para los procesos de registro y posterior autenticación.
 */
const usuarioEsquema = new mongoose.Schema(
    {
        // Campo identificador del usuario para el inicio de sesión
        usuario: {
            type: String,
            required: [true, 'El nombre de usuario es obligatorio'],
            unique: true,
            trim: true,
            validate: {
                validator: function (valor) {
                    return typeof valor === 'string' && valor.trim().length > 0;
                },
                message: 'El nombre de usuario no puede estar vacío'
            }
        },
        // Hash seguro de la contraseña del usuario generado mediante bcryptjs
        contrasena: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            trim: true,
            validate: {
                validator: function (valor) {
                    return typeof valor === 'string' && valor.trim().length > 0;
                },
                message: 'La contraseña no puede estar vacía'
            }
        }
    },
    {
        // Registra automáticamente la fecha de creación (createdAt) y actualización (updatedAt)
        timestamps: true,
        versionKey: false
    }
);

// Creación del modelo 'Usuario' a partir del esquema
const Usuario = mongoose.model('Usuario', usuarioEsquema);

// Exportación del modelo para su uso en controladores y servicios
module.exports = Usuario;
