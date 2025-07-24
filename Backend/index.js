import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas de la API
app.use('/api', routes);

// Ruta de prueba principal
app.get('/', (req, res) => {
  res.json({
    message: '🚀 DerivApp Backend funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      api: '/api',
      auth: '/api/auth',
      estudiantes: '/api/estudiantes',
      casos: '/api/casos',
      informes: '/api/informes',
      alertas: '/api/alertas',
      intervenciones: '/api/intervenciones'
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    availableEndpoints: {
      api: '/api',
      root: '/'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 API disponible en: http://localhost:${PORT}/api`);
  console.log(`🏠 Página principal: http://localhost:${PORT}`);
  console.log(`⏰ Iniciado: ${new Date().toISOString()}`);
});

export default app;

