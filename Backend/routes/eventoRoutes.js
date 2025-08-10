import express from 'express';
import {
  crearEventoController,
  obtenerEventosController,
  obtenerEventoPorIdController,
  actualizarEventoController,
  eliminarEventoController,
  obtenerEventosPorEstudianteController,
  obtenerEventosPorDerivacionController,
  obtenerEventosProximosController,
  obtenerEventosPorTipoController,
  obtenerEventosPorPrioridadController,
  crearEventoDesdeAlertaController,
  obtenerEstadisticasEventosController
} from '../controllers/eventoController.js';

const router = express.Router();

// Middleware para logging
router.use((req, res, next) => {
  console.log('=== EVENTO ROUTE HIT ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Params:', req.params);
  next();
});

// Rutas básicas CRUD - ahora como subcolección de derivaciones
router.post('/', crearEventoController);
router.get('/', obtenerEventosController);
router.get('/estadisticas', obtenerEstadisticasEventosController);
router.get('/proximos', obtenerEventosProximosController);
router.get('/:id', obtenerEventoPorIdController);
router.put('/:id', actualizarEventoController);
router.delete('/:id', eliminarEventoController);

// Rutas por filtros
router.get('/tipo/:tipo', obtenerEventosPorTipoController);
router.get('/prioridad/:prioridad', obtenerEventosPorPrioridadController);

// Rutas por estudiante y derivación
router.get('/estudiante/:estudianteId', obtenerEventosPorEstudianteController);
router.get('/derivacion/:estudianteId/:derivacionId', obtenerEventosPorDerivacionController);

// Ruta especial para crear evento desde alerta
router.post('/desde-alerta', crearEventoDesdeAlertaController);

export default router; 