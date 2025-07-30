import express from 'express';
import {
  crearFormularioCtrl,
  obtenerFormulariosCtrl,
  obtenerFormularioPorIdCtrl,
  actualizarFormularioCtrl,
  eliminarFormularioCtrl,
  obtenerFormulariosPorDerivacionCtrl,
  obtenerFormulariosPorTipoCtrl,
  obtenerFormulariosPorCreadorCtrl,
  obtenerFormulariosRecientesCtrl,
  generarFormularioIACtrl,
  obtenerInformesIntervencionCtrl,
  obtenerPlanesAccionCtrl,
  buscarFormulariosCtrl,
  obtenerEstadisticasFormulariosCtrl
} from '../controllers/formularioController.js';

const router = express.Router();

// ===== RUTAS DE FORMULARIOS =====

// Rutas básicas de formularios
router.post('/', crearFormularioCtrl);
router.get('/', obtenerFormulariosCtrl);
router.get('/buscar', buscarFormulariosCtrl);
router.get('/recientes', obtenerFormulariosRecientesCtrl);
router.get('/estadisticas', obtenerEstadisticasFormulariosCtrl);
router.get('/:id', obtenerFormularioPorIdCtrl);
router.put('/:id', actualizarFormularioCtrl);
router.delete('/:id', eliminarFormularioCtrl);

// ===== RUTAS DE GENERACIÓN CON IA =====

// Ruta para generar formularios con IA
router.post('/generar-ia', generarFormularioIACtrl);

// ===== RUTAS DE FILTROS =====

// Rutas de filtros por derivación
router.get('/derivacion/:derivacionId', obtenerFormulariosPorDerivacionCtrl);

// Rutas de filtros por tipo
router.get('/tipo/:tipo', obtenerFormulariosPorTipoCtrl);

// Rutas de filtros por creador
router.get('/creador/:creadoPor', obtenerFormulariosPorCreadorCtrl);

// ===== RUTAS ESPECÍFICAS POR TIPO =====

// Rutas específicas para informes de intervención
router.get('/informes/intervencion', obtenerInformesIntervencionCtrl);

// Rutas específicas para planes de acción
router.get('/planes/accion', obtenerPlanesAccionCtrl);

export default router; 