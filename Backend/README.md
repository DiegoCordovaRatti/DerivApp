# DerivApp Backend

Backend API para el sistema de derivaciones escolares DerivApp.

## 🚀 Características

- **Autenticación** de usuarios
- **Gestión de estudiantes** con información completa
- **Casos/derivaciones** con seguimiento
- **Informes** escritos por profesionales
- **Alertas** automáticas
- **Intervenciones** registradas
- **API RESTful** completa
- **Firestore** como base de datos

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Proyecto Firebase configurado

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
cd Backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env basado en .env.example
cp .env.example .env
```

4. **Editar .env con tus configuraciones**
```env
PORT=3000
NODE_ENV=development

# Firebase Configuration
FIREBASE_API_KEY=tu_api_key_aqui
FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu_proyecto_id
FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 🏃‍♂️ Ejecutar

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Endpoints de la API

### 🔐 Autenticación
- `POST /api/auth/registrar` - Registrar usuario
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/perfil` - Obtener perfil
- `PUT /api/auth/perfil` - Actualizar perfil
- `PUT /api/auth/cambiar-password` - Cambiar contraseña

### 👨‍🎓 Estudiantes
- `POST /api/estudiantes` - Crear estudiante
- `GET /api/estudiantes` - Listar todos
- `GET /api/estudiantes/:id` - Obtener por ID
- `PUT /api/estudiantes/:id` - Actualizar
- `DELETE /api/estudiantes/:id` - Eliminar

### 📋 Casos
- `POST /api/casos` - Crear caso
- `GET /api/casos` - Listar todos
- `GET /api/casos/:id` - Obtener por ID
- `PUT /api/casos/:id` - Actualizar
- `DELETE /api/casos/:id` - Eliminar

### 📄 Informes
- `POST /api/informes` - Crear informe
- `GET /api/informes` - Listar todos
- `GET /api/informes/:id` - Obtener por ID
- `PUT /api/informes/:id` - Actualizar
- `DELETE /api/informes/:id` - Eliminar

### ⚠️ Alertas
- `POST /api/alertas` - Crear alerta
- `GET /api/alertas` - Listar todas
- `GET /api/alertas/:id` - Obtener por ID
- `PUT /api/alertas/:id` - Actualizar
- `DELETE /api/alertas/:id` - Eliminar

### 🏥 Intervenciones
- `POST /api/intervenciones` - Crear intervención
- `GET /api/intervenciones` - Listar todas
- `GET /api/intervenciones/:id` - Obtener por ID
- `PUT /api/intervenciones/:id` - Actualizar
- `DELETE /api/intervenciones/:id` - Eliminar

## 📝 Ejemplos de uso

### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carla Muñoz",
    "correo": "carla@colegio.cl",
    "rol": "psicologo",
    "telefono": "+56912345678",
    "password": "123456"
  }'
```

### Crear estudiante
```bash
curl -X POST http://localhost:3000/api/estudiantes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "rut": "12.345.678-9",
    "curso": "6°B",
    "estado": "activo",
    "fechaIngreso": "2025-04-03",
    "contactoApoderado": {
      "nombre": "María González",
      "telefono": "+56998765432",
      "correo": "maria@gmail.com"
    }
  }'
```

## 🏗️ Estructura del proyecto

```
Backend/
├── config/
│   └── fireBaseDB.js      # Configuración de Firebase
├── controllers/
│   ├── authController.js
│   ├── estudianteController.js
│   ├── casoController.js
│   ├── informeController.js
│   ├── alertaController.js
│   └── intervencionController.js
├── models/
│   ├── Usuario.js
│   ├── Estudiante.js
│   ├── Caso.js
│   ├── Informe.js
│   ├── Alerta.js
│   └── Intervencion.js
├── routes/
│   ├── authRoutes.js
│   ├── estudianteRoutes.js
│   ├── casoRoutes.js
│   ├── informeRoutes.js
│   ├── alertaRoutes.js
│   ├── intervencionRoutes.js
│   └── index.js
├── index.js               # Servidor principal
├── package.json
└── README.md
```

## 🔍 Testing

Puedes probar la API usando:
- **Postman**
- **Insomnia**
- **curl** (ejemplos arriba)
- **Thunder Client** (extensión de VS Code)

## 🐛 Troubleshooting

### Error de conexión a Firebase
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que el proyecto Firebase esté activo

### Error de puerto en uso
- Cambia el puerto en `.env`: `PORT=3001`
- O mata el proceso que usa el puerto 3000

### Error de módulos
- Ejecuta `npm install` nuevamente
- Verifica que estés usando Node.js 16+

## 📄 Licencia

Este proyecto es parte de DerivApp.

