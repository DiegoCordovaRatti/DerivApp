import express from 'express';
import {
  crearActividadCtrl,
  obtenerActividadesCtrl,
  obtenerActividadPorIdCtrl,
  obtenerActividadesPorUsuarioCtrl,
  obtenerActividadesPorTipoAccionCtrl,
  obtenerActividadesPorObjetoCtrl,
  obtenerActividadesRecientesCtrl,
  obtenerActividadesPorFechaCtrl,
  obtenerEstadisticasActividadesCtrl,
  logCreacionCtrl,
  logActualizacionCtrl,
  logEliminacionCtrl,
  logVisualizacionCtrl,
  buscarActividadesCtrl
} from '../controllers/actividadController.js';

const router = express.Router();

// ===== RUTAS DE ACTIVIDADES =====

// Rutas básicas de actividades
router.post('/', crearActividadCtrl);
router.get('/', obtenerActividadesCtrl);
router.get('/buscar', buscarActividadesCtrl);
router.get('/recientes', obtenerActividadesRecientesCtrl);
router.get('/estadisticas', obtenerEstadisticasActividadesCtrl);
router.get('/:id', obtenerActividadPorIdCtrl);

// ===== RUTAS DE FILTROS =====

// Rutas de filtros por usuario
router.get('/usuario/:usuarioId', obtenerActividadesPorUsuarioCtrl);

// Rutas de filtros por tipo de acción
router.get('/accion/:tipoAccion', obtenerActividadesPorTipoAccionCtrl);

// Rutas de filtros por objeto afectado
router.get('/objeto/:objetoAfectado', obtenerActividadesPorObjetoCtrl);

// Rutas de filtros por fecha
router.get('/fecha/:fecha', obtenerActividadesPorFechaCtrl);

// ===== RUTAS DE LOGS AUTOMÁTICOS =====

// Rutas para logs automáticos (helpers)
router.post('/log/creacion', logCreacionCtrl);
router.post('/log/actualizacion', logActualizacionCtrl);
router.post('/log/eliminacion', logEliminacionCtrl);
router.post('/log/visualizacion', logVisualizacionCtrl);

export default router; 