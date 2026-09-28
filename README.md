# API de Autenticación

## Información del Proyecto
- **Evidencia SENA:** GA7-220501096-AA5-EV01 - "Diseño y desarrollo de servicios web - caso"
- **Grupo:** 6
- **Ficha:** 3336134

## Descripción
Servicio web REST desarrollado con Node.js, Express y MongoDB para la gestión y autenticación de usuarios. Cuenta con los servicios completos de registro de usuarios (`POST /api/auth/register`) e inicio de sesión (`POST /api/auth/login`) con hashing seguro mediante `bcryptjs` e interfaz web cliente.

## Tecnologías Utilizadas
- **Node.js**: Entorno de ejecución para el backend.
- **Express**: Framework web minimalista para Node.js.
- **MongoDB Community Server**: Base de datos NoSQL documental local.
- **Mongoose**: Modelado de datos (ODM) y conexión con MongoDB.
- **Dotenv**: Gestión de variables de entorno.
- **Bcryptjs**: Algoritmo seguro de hashing para almacenamiento y comparación protegida de contraseñas.
- **Nodemon**: Herramienta de desarrollo para reinicio automático.

## Estructura del Proyecto
```text
API_AUTENTICACION/
├── config/
│   └── database.js
├── controllers/
│   └── authController.js
├── models/
│   └── Usuario.js
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── routes/
│   └── authRoutes.js
├── .env.example
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

> **Nota:** El archivo `.env` se crea localmente a partir de `.env.example` y está excluido del control de versiones por seguridad.

## Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/API_AUTENTICACION
PORT=3000
```

## Comandos para Ejecutar el Proyecto

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

3. **Ejecutar en producción:**
   ```bash
   npm start
   ```

## Interfaz web

El proyecto incluye una interfaz web cliente visual (desarrollada con HTML, CSS y JavaScript vanilla) para consumir interactivamente los servicios de registro de usuarios e inicio de sesión desde el navegador.

Para ejecutar la aplicación y visualizar la interfaz:

1. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

2. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir el navegador en la siguiente dirección:
   ```text
   http://localhost:3000
   ```

> **Nota:** Todos los endpoints de la API REST (`POST /api/auth/register` y `POST /api/auth/login`) continúan plenamente disponibles para pruebas y consumo mediante herramientas como Postman, Thunder Client o cURL.

## Endpoints Disponibles

### 1. Interfaz Web y Comprobación del Servidor
- **Método:** `GET`
- **Ruta:** `/`
- **Respuesta (200 OK):** Interfaz web cliente servida estáticamente desde la carpeta `public/` (`index.html`).

### 2. Registro de Usuario
- **Método:** `POST`
- **Ruta:** `/api/auth/register`
- **Cuerpo de la Solicitud (JSON):**
  ```json
  {
      "usuario": "carlos",
      "contrasena": "123456"
  }
  ```
- **Respuestas posibles:**
  - **201 Created**: Usuario registrado exitosamente (contraseña almacenada como hash bcrypt, sin exponer datos sensibles en la respuesta).
  - **400 Bad Request**: Campos obligatorios faltantes o vacíos.
  - **409 Conflict**: El nombre de usuario ya existe en la base de datos.
  - **500 Internal Server Error**: Error inesperado en el servidor.

### 3. Inicio de Sesión (Login)
- **Método:** `POST`
- **Ruta:** `/api/auth/login`
- **Cuerpo de la Solicitud (JSON):**
  ```json
  {
      "usuario": "carlos",
      "contrasena": "123456"
  }
  ```
- **Respuestas posibles:**
  - **200 OK**: Autenticación exitosa tras validar la contraseña contra el hash de MongoDB con `bcrypt.compare()`.
  - **400 Bad Request**: Campos obligatorios faltantes o vacíos.
  - **401 Unauthorized**: Credenciales inválidas (usuario no existe o contraseña incorrecta).
  - **500 Internal Server Error**: Error inesperado en el servidor.
