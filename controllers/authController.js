// ====================================================================
// Evidencia SENA: GA7-220501096-AA5-EV01
// "Diseño y desarrollo de servicios web - caso"
// Grupo: 6 | Ficha: 3336134
// Controlador de autenticación para la gestión de usuarios
// ====================================================================

const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

/**
 * Controlador para el registro de nuevos usuarios en el sistema.
 * Aplica hashing seguro sobre la contraseña antes de persistir en MongoDB.
 * Endpoint: POST /api/auth/register
 *
 * @param {import('express').Request} req - Objeto de solicitud HTTP
 * @param {import('express').Response} res - Objeto de respuesta HTTP
 * @returns {Promise<void>}
 */
const registrarUsuario = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        // 1. Verificación de presencia de los campos obligatorios
        if (!usuario || !contrasena) {
            return res.status(400).json({
                mensaje: 'Error de validación: los campos usuario y contrasena son obligatorios'
            });
        }

        // 2. Verificación de que los valores no sean cadenas vacías o solo espacios en blanco
        if (
            typeof usuario !== 'string' ||
            typeof contrasena !== 'string' ||
            usuario.trim() === '' ||
            contrasena.trim() === ''
        ) {
            return res.status(400).json({
                mensaje: 'Error de validación: los campos usuario y contrasena no pueden estar vacíos'
            });
        }

        const nombreUsuarioLimpio = usuario.trim();
        const contrasenaLimpia = contrasena.trim();

        // 3. Verificación de si el usuario ya existe previamente en la base de datos
        const usuarioExistente = await Usuario.findOne({ usuario: nombreUsuarioLimpio });

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: 'Conflicto: el usuario ya se encuentra registrado'
            });
        }

        // 4. Procesamiento seguro de la contraseña mediante bcryptjs
        // SEGURIDAD: Jamás se debe almacenar una contraseña en texto plano en la base de datos.
        // Si el sistema o la base de datos llegasen a ser vulnerados, las contraseñas reales no
        // podrán ser leídas directamente. El uso de bcrypt con salt (salto aleatorio de 10 rondas)
        // garantiza que la función sea unidireccional y resistente a ataques de tablas arcoíris (rainbow tables).
        const rondasSal = 10;
        const salGenerada = await bcrypt.genSalt(rondasSal);
        const contrasenaHasheada = await bcrypt.hash(contrasenaLimpia, salGenerada);

        // 5. Creación de la instancia del modelo Usuario guardando ÚNICAMENTE el hash
        const nuevoUsuario = new Usuario({
            usuario: nombreUsuarioLimpio,
            contrasena: contrasenaHasheada
        });

        await nuevoUsuario.save();

        // 6. Respuesta exitosa (HTTP 201) sin exponer la contraseña ni el hash
        return res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            datos: {
                id: nuevoUsuario._id,
                usuario: nuevoUsuario.usuario,
                createdAt: nuevoUsuario.createdAt
            }
        });
    } catch (error) {
        // Manejo centralizado de errores imprevistos
        console.error('Error en registrarUsuario:', error.message);
        return res.status(500).json({
            mensaje: 'Error interno del servidor al procesar el registro de usuario'
        });
    }
};

/**
 * Controlador para la autenticación e inicio de sesión de usuarios.
 * Valida las credenciales proporcionadas comparando la contraseña con el hash almacenado mediante bcryptjs.
 * Endpoint: POST /api/auth/login
 *
 * @param {import('express').Request} req - Objeto de solicitud HTTP
 * @param {import('express').Response} res - Objeto de respuesta HTTP
 * @returns {Promise<void>}
 */
const iniciarSesion = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        // 1. Verificación de presencia de los campos obligatorios
        if (!usuario || !contrasena) {
            return res.status(400).json({
                mensaje: 'Error de validación: los campos usuario y contrasena son obligatorios'
            });
        }

        // 2. Verificación de que los valores no sean cadenas vacías o solo espacios en blanco
        if (
            typeof usuario !== 'string' ||
            typeof contrasena !== 'string' ||
            usuario.trim() === '' ||
            contrasena.trim() === ''
        ) {
            return res.status(400).json({
                mensaje: 'Error de validación: los campos usuario y contrasena no pueden estar vacíos'
            });
        }

        const nombreUsuarioLimpio = usuario.trim();
        const contrasenaLimpia = contrasena.trim();

        // 3. Búsqueda del usuario en la base de datos por su identificador
        const usuarioEncontrado = await Usuario.findOne({ usuario: nombreUsuarioLimpio });

        // Si el usuario no existe en la base de datos, se responde con HTTP 401
        if (!usuarioEncontrado) {
            return res.status(401).json({
                mensaje: 'Credenciales inválidas: el usuario o la contraseña son incorrectos'
            });
        }

        // 4. Verificación de la contraseña mediante comparación segura con el hash
        // SEGURIDAD: Nunca se compara directamente texto plano contra texto plano.
        // bcrypt.compare() procesa la contraseña suministrada junto con el salt almacenado en el hash
        // y determina si corresponden sin revelar la contraseña original.
        const esContrasenaValida = await bcrypt.compare(contrasenaLimpia, usuarioEncontrado.contrasena);

        // Si la contraseña no coincide con el hash, se responde con HTTP 401
        if (!esContrasenaValida) {
            return res.status(401).json({
                mensaje: 'Credenciales inválidas: el usuario o la contraseña son incorrectos'
            });
        }

        // 5. Respuesta exitosa (HTTP 200) confirmando que las credenciales son correctas
        // Se omite deliberadamente cualquier dato sensible (contraseña o hash)
        return res.status(200).json({
            mensaje: 'Autenticación exitosa: las credenciales son correctas',
            datos: {
                id: usuarioEncontrado._id,
                usuario: usuarioEncontrado.usuario
            }
        });
    } catch (error) {
        // Manejo centralizado de errores imprevistos
        console.error('Error en iniciarSesion:', error.message);
        return res.status(500).json({
            mensaje: 'Error interno del servidor al procesar el inicio de sesión'
        });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion
};
