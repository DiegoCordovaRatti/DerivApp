import express from 'express';
import {
  crearIntervencionCtrl,
  obtenerIntervencionesDerivacionCtrl,
  obtenerTodasIntervencionesCtrl,
  obtenerIntervencionPorIdCtrl,
  obtenerIntervencionesPorTipoCtrl,
  obtenerIntervencionesPorProfesionalCtrl,
  obtenerIntervencionesPorFechaCtrl,
  actualizarIntervencionCtrl,
  eliminarIntervencionCtrl,
  obtenerContactosCtrl,
  obtenerVisitasCtrl,
  obtenerActualizacionesCtrl,
  obtenerInformesCtrl,
  obtenerIntervencionesRecientesCtrl,
  obtenerEstadisticasIntervencionesCtrl
} from '../controllers/intervencionController.js';

const router = express.Router();

// ===== RUTAS DE INTERVENCIONES =====

// Rutas de intervenciones por derivación (jerárquicas)
router.post('/estudiantes/:estudianteId/derivaciones/:derivacionId', crearIntervencionCtrl);
router.get('/estudiantes/:estudianteId/derivaciones/:derivacionId', obtenerIntervencionesDerivacionCtrl);
router.get('/estudiantes/:estudianteId/derivaciones/:derivacionId/:intervencionId', obtenerIntervencionPorIdCtrl);
router.put('/estudiantes/:estudianteId/derivaciones/:derivacionId/:intervencionId', actualizarIntervencionCtrl);
router.delete('/estudiantes/:estudianteId/derivaciones/:derivacionId/:intervencionId', eliminarIntervencionCtrl);

// Rutas globales de intervenciones
router.get('/', obtenerTodasIntervencionesCtrl);
router.get('/recientes', obtenerIntervencionesRecientesCtrl);
router.get('/estadisticas', obtenerEstadisticasIntervencionesCtrl);

// Rutas de filtros
router.get('/tipo/:tipo', obtenerIntervencionesPorTipoCtrl);
router.get('/profesional/:creadoPor', obtenerIntervencionesPorProfesionalCtrl);
router.get('/fecha/:fecha', obtenerIntervencionesPorFechaCtrl);

// Rutas específicas por tipo
router.get('/contactos', obtenerContactosCtrl);
router.get('/visitas', obtenerVisitasCtrl);
router.get('/actualizaciones', obtenerActualizacionesCtrl);
router.get('/informes', obtenerInformesCtrl);

export default router; 