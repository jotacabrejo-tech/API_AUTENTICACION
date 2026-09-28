// ====================================================================
// Evidencia SENA: GA7-220501096-AA5-EV01
// "Diseño y desarrollo de servicios web - caso"
// Grupo: 6 | Ficha: 3336134
// Definición de rutas para el módulo de autenticación
// ====================================================================

const express = require('express');
const router = express.Router();
const { registrarUsuario, iniciarSesion } = require('../controllers/authController');

// Ruta para el registro de usuarios
// Endpoint completo: POST /api/auth/register
router.post('/register', registrarUsuario);

// Ruta para el inicio de sesión de usuarios
// Endpoint completo: POST /api/auth/login
router.post('/login', iniciarSesion);

module.exports = router;
