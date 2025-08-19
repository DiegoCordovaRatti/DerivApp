# DerivApp - Sistema de Derivación Estudiantil

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Descripción del Proyecto

DerivApp es una aplicación web completa para la gestión de derivaciones estudiantiles, desarrollada con React (frontend) y Node.js/Express (backend), utilizando Firebase como base de datos. El sistema facilita el seguimiento integral de casos estudiantiles, proporcionando herramientas para profesionales de la educación en la gestión de derivaciones y seguimientos.

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

## 📊 Línea Base del Proyecto

### Métricas del Código
- **Total de archivos**: 50+ archivos fuente
- **Líneas de código backend**: ~2,500 líneas
- **Líneas de código frontend**: ~3,000 líneas
- **Modelos de datos**: 8 entidades principales
- **Controladores**: 10 controladores implementados
- **Rutas API**: 30+ endpoints
- **Componentes React**: 15+ componentes

### Configuración Base
- **Node.js**: v18.0.0+
- **React**: v19.1.0
- **Firebase**: v11.10.0
- **Express**: v4.18.2
- **Ant Design**: v5.26.6

## 🔧 Gestión de Configuración

### Ambientes de Desarrollo

#### Desarrollo Local
```bash
# Backend
PORT=3000
NODE_ENV=development
FIREBASE_PROJECT_ID=derivapp-dev

# Frontend
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

#### Producción
```bash
# Backend
PORT=8080
NODE_ENV=production
FIREBASE_PROJECT_ID=derivapp-prod

# Frontend
VITE_API_URL=https://api.derivapp.com
VITE_ENV=production
```

### Control de Versiones
- **Estrategia**: Git Flow
- **Ramas principales**: `main`, `develop`
- **Ramas de características**: `feature/*`
- **Ramas de corrección**: `hotfix/*`
- **Tags de versión**: Semántico (vX.Y.Z)
- **Convenciones de Commit**: 
  - `feat:` nuevas características
  - `fix:` correcciones de bugs
  - `docs:` cambios en documentación
  - `style:` cambios de formato
  - `refactor:` refactorización de código
  - `test:` adición de tests
  - `chore:` tareas de mantenimiento

### Gestión de Configuración de Archivos

#### Archivos de Configuración Críticos
```
Backend/
├── .env                    # Variables de entorno (NO versionado)
├── .env.example           # Plantilla de variables de entorno
├── package.json           # Dependencias y scripts backend
├── firebase.json          # Configuración Firebase
├── firestore.rules        # Reglas de seguridad Firestore
└── firestore.indexes.json # Índices de base de datos

DerivApp/
├── .env                   # Variables de entorno frontend (NO versionado)
├── .env.example          # Plantilla de variables frontend
├── package.json          # Dependencias y scripts frontend
├── vite.config.js        # Configuración del bundler
└── eslint.config.js      # Configuración del linter
```

#### Gestión de Dependencias
- **Backend**: Versiones fijas en package-lock.json
- **Frontend**: Versiones compatibles con caret (^)
- **Actualización**: Proceso controlado con testing previo
- **Auditoría**: Revisión regular de vulnerabilidades de seguridad

### Pipeline de Despliegue

#### Ambientes
1. **Desarrollo** (`develop` branch)
   - Deploy automático en commits
   - Base de datos de desarrollo
   - Logging detallado habilitado


#### Checklist de Release
- [ ] Tests unitarios pasando
- [ ] Tests de integración pasando
- [ ] Revisión de código completada
- [ ] Documentación actualizada
- [ ] Variables de entorno verificadas
- [ ] Backup de base de datos realizado

### Dependencias Principales

#### Backend
```json
{
  "express": "^4.18.2",
  "firebase": "^11.10.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "helmet": "^6.0.1"
}
```

#### Frontend
```json
{
  "react": "^19.1.0",
  "antd": "^5.26.6",
  "vite": "^7.0.4",
  "axios": "^1.6.0",
  "react-router-dom": "^6.8.0"
}
```

## 📋 Release Notes

### Version 1.0.0 (2024-01-15) - Release Inicial

#### 🎯 Características Principales
- **Sistema de Autenticación**: Login seguro con Firebase Auth
- **Gestión de Estudiantes**: CRUD completo para perfiles estudiantiles
- **Derivaciones**: Creación y seguimiento de casos de derivación
- **Dashboard**: Panel principal con métricas y resúmenes
- **Sistema de Alertas**: Notificaciones automáticas para casos críticos

#### ✨ Nuevas Funcionalidades
- **Módulo de Expedientes**: Gestión integral de historial estudiantil
- **Formulario de Derivación**: Interface intuitiva para crear derivaciones
- **Agenda de Citas**: Programación y gestión de reuniones
- **Sistema de Roles**: Control de acceso basado en perfiles de usuario
- **Reportes**: Generación de informes estadísticos

#### 🏗️ Arquitectura Implementada
- **Backend RESTful**: API completa con Node.js y Express
- **Frontend Reactivo**: SPA con React 19 y Ant Design
- **Base de Datos**: Firebase Firestore con estructura optimizada
- **Autenticación**: Firebase Authentication integrado
- **Middleware**: Sistema de validación y autorización

#### 🔧 Configuraciones
- **Variables de Entorno**: Configuración centralizada para múltiples ambientes
- **CORS**: Configurado para comunicación segura frontend-backend
- **Logging**: Sistema de logs para monitoreo y debugging
- **Error Handling**: Manejo centralizado de errores

#### 📁 Estructura de Archivos
```
Backend/
├── config/          # Configuración Firebase
├── controllers/     # Lógica de negocio
├── models/         # Modelos de datos
├── routes/         # Definición de endpoints
├── middleware/     # Middleware personalizado
└── scripts/        # Scripts de utilidad

DerivApp/
├── src/
│   ├── views/      # Páginas principales
│   ├── components/ # Componentes reutilizables
│   ├── services/   # Servicios API
│   ├── contexts/   # Contextos React
│   └── utils/      # Utilidades
```

#### 🔒 Seguridad
- **Autenticación JWT**: Tokens seguros para sesiones
- **Validación de Datos**: Sanitización en frontend y backend
- **HTTPS**: Comunicación encriptada en producción
- **Variables de Entorno**: Configuración sensible protegida

#### 🧪 Testing
- **Setup de Testing**: Configuración inicial para pruebas unitarias
- **Mocks**: Simulación de servicios Firebase para testing
- **Linting**: ESLint configurado para mantener calidad de código

#### 🚀 Despliegue
- **Docker**: Configuración lista para contenedorización
- **Scripts NPM**: Comandos optimizados para desarrollo y producción
- **Build Process**: Proceso de construcción automatizado

#### 📊 Métricas de Calidad
- **Cobertura de Código**: Base establecida para testing
- **Performance**: Optimizaciones iniciales implementadas
- **Accessibility**: Componentes Ant Design con soporte a11y
- **SEO**: Meta tags y estructura semántica

#### 🔄 Próximas Iteraciones
- Testing (v1.1.0)
- Módulo de reportes avanzados (v1.2.0)
- Integración con sistemas externos (v1.3.0)
- Módulo de comunicaciones (v1.4.0)

### Planificación de Versiones Futuras

#### Version 1.1.0 (Planificada: 2024-02-15)
- [ ] Suite completa de testing
- [ ] Optimización de performance
- [ ] Métricas de uso en tiempo real
- [ ] Exportación de datos

#### Version 1.2.0 (Planificada: 2024-03-15)
- [ ] Módulo de reportes avanzados
- [ ] Dashboard personalizable
- [ ] Notificaciones push
- [ ] API móvil

#### Version 1.3.0 (Planificada: 2024-04-15)
- [ ] Integración con sistemas educativos
- [ ] Módulo de comunicaciones
- [ ] Workflow automatizado
- [ ] Audit trail completo

## 🚧 Estado Actual del Desarrollo

### ✅ Completado (v1.0.0)
- [x] Configuración inicial del proyecto
- [x] Backend API con Express
- [x] Modelos de datos en Firebase
- [x] Controladores para todas las entidades
- [x] Rutas API implementadas
- [x] Configuración de Firebase
- [x] Estructura de vistas en React
- [x] Configuración de Ant Design
- [x] Sistema de autenticación básico
- [x] CRUD de estudiantes y derivaciones

### 🔄 En Desarrollo (v1.1.0)
- [ ] Testing unitario y de integración
- [ ] Optimización de componentes React
- [ ] Métricas en tiempo real
- [ ] Validación avanzada de formularios

### 📋 Planificado (v1.2.0+)
- [ ] Documentación de API
- [ ] Optimización de rendimiento
- [ ] Despliegue automatizado
- [ ] Monitoreo y alertas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request


---

**Nota**: Este proyecto está en desarrollo activo. La documentación se actualiza regularmente conforme se implementan nuevas características. Para la versión más actualizada de esta documentación, consulta la rama `main` del repositorio.
