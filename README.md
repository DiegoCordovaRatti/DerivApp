# DerivApp - Sistema de Derivación Estudiantil

## 📋 Descripción del Proyecto

DerivApp es una aplicación web completa para la gestión de derivaciones estudiantiles, desarrollada con React (frontend) y Node.js/Express (backend), utilizando Firebase como base de datos.

## 🏗️ Arquitectura del Proyecto

El proyecto está estructurado en dos partes principales:

### Frontend (DerivApp/)
- **Tecnología**: React 19 + Vite
- **UI Framework**: Ant Design (antd)
- **Estructura**: Componentes organizados en vistas modulares

### Backend (Backend/)
- **Tecnología**: Node.js + Express
- **Base de Datos**: Firebase Firestore
- **Arquitectura**: MVC (Model-View-Controller)

## 🚀 Características Implementadas

### Backend API

#### Modelos de Datos
- **Usuario**: Gestión de usuarios del sistema
- **Estudiante**: Información de estudiantes
- **Caso**: Casos de derivación
- **Informe**: Informes de seguimiento
- **Alerta**: Sistema de alertas
- **Intervención**: Registro de intervenciones

#### Controladores Implementados
- `authController.js` - Autenticación y autorización
- `estudianteController.js` - Gestión de estudiantes
- `casoController.js` - Gestión de casos de derivación
- `informeController.js` - Gestión de informes
- `alertaController.js` - Sistema de alertas
- `intervencionController.js` - Gestión de intervenciones

#### Rutas API
- `/api/auth` - Autenticación
- `/api/estudiantes` - Gestión de estudiantes
- `/api/casos` - Gestión de casos
- `/api/informes` - Gestión de informes
- `/api/alertas` - Sistema de alertas
- `/api/intervenciones` - Gestión de intervenciones

### Frontend

#### Vistas Implementadas
- **Dashboard** - Panel principal
- **Login** - Autenticación de usuarios
- **Perfil** - Gestión de perfil de usuario
- **Expedientes** - Gestión de expedientes estudiantiles
- **FormularioDerivacion** - Formulario para crear derivaciones
- **Agenda** - Gestión de agenda y citas
- **Alertas** - Sistema de alertas
- **Error** - Página de manejo de errores

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 19.1.0
- Vite 7.0.4
- Ant Design 5.26.6
- ESLint para linting

### Backend
- Node.js
- Express 4.18.2
- Firebase 11.10.0 (Firestore)
- CORS para manejo de CORS
- dotenv para variables de entorno

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Firebase

### Configuración del Backend

1. **Instalar dependencias**:
```bash
cd Backend
npm install
```

2. **Configurar variables de entorno**:
Crear archivo `.env` en la carpeta `Backend/` con:
```
PORT=3000
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_auth_domain
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_STORAGE_BUCKET=tu_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
FIREBASE_APP_ID=tu_app_id
```

3. **Iniciar servidor de desarrollo**:
```bash
npm run dev
```

### Configuración del Frontend

1. **Instalar dependencias**:
```bash
cd DerivApp
npm install
```

2. **Iniciar servidor de desarrollo**:
```bash
npm run dev
```

## 🔧 Scripts Disponibles

### Backend
- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en modo desarrollo con nodemon

### Frontend
- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run lint` - Ejecutar ESLint
- `npm run preview` - Vista previa de la build

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión

### Estudiantes
- `GET /api/estudiantes` - Obtener lista de estudiantes
- `POST /api/estudiantes` - Crear nuevo estudiante
- `GET /api/estudiantes/:id` - Obtener estudiante por ID
- `PUT /api/estudiantes/:id` - Actualizar estudiante
- `DELETE /api/estudiantes/:id` - Eliminar estudiante

### Casos
- `GET /api/casos` - Obtener lista de casos
- `POST /api/casos` - Crear nuevo caso
- `GET /api/casos/:id` - Obtener caso por ID
- `PUT /api/casos/:id` - Actualizar caso
- `DELETE /api/casos/:id` - Eliminar caso

### Informes
- `GET /api/informes` - Obtener lista de informes
- `POST /api/informes` - Crear nuevo informe
- `GET /api/informes/:id` - Obtener informe por ID
- `PUT /api/informes/:id` - Actualizar informe
- `DELETE /api/informes/:id` - Eliminar informe

### Alertas
- `GET /api/alertas` - Obtener lista de alertas
- `POST /api/alertas` - Crear nueva alerta
- `GET /api/alertas/:id` - Obtener alerta por ID
- `PUT /api/alertas/:id` - Actualizar alerta
- `DELETE /api/alertas/:id` - Eliminar alerta

### Intervenciones
- `GET /api/intervenciones` - Obtener lista de intervenciones
- `POST /api/intervenciones` - Crear nueva intervención
- `GET /api/intervenciones/:id` - Obtener intervención por ID
- `PUT /api/intervenciones/:id` - Actualizar intervención
- `DELETE /api/intervenciones/:id` - Eliminar intervención

## 🔒 Seguridad

- Autenticación mediante Firebase Auth
- CORS configurado para permitir comunicación entre frontend y backend
- Variables de entorno para configuración sensible
- Validación de datos en controladores

## 📁 Estructura del Proyecto

```
DerivApp/
├── Backend/                 # Servidor Node.js/Express
│   ├── config/             # Configuración de Firebase
│   ├── controllers/        # Controladores de la API
│   ├── models/            # Modelos de datos
│   ├── routes/            # Definición de rutas
│   └── index.js           # Punto de entrada del servidor
├── DerivApp/              # Aplicación React
│   ├── src/
│   │   ├── views/         # Componentes de vistas
│   │   ├── assets/        # Recursos estáticos
│   │   └── App.jsx        # Componente principal
│   └── package.json
└── README.md
```

## 🚧 Estado Actual del Desarrollo

### ✅ Completado
- [x] Configuración inicial del proyecto
- [x] Backend API con Express
- [x] Modelos de datos en Firebase
- [x] Controladores para todas las entidades
- [x] Rutas API implementadas
- [x] Configuración de Firebase
- [x] Estructura de vistas en React
- [x] Configuración de Ant Design

### 🔄 En Desarrollo
- [ ] Implementación de componentes React
- [ ] Integración frontend-backend
- [ ] Sistema de autenticación en frontend
- [ ] Formularios de gestión de datos

### 📋 Pendiente
- [ ] Testing unitario y de integración
- [ ] Documentación de API
- [ ] Optimización de rendimiento
- [ ] Despliegue en producción

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Nota**: Este proyecto está en desarrollo activo. La documentación se actualiza regularmente conforme se implementan nuevas características.
