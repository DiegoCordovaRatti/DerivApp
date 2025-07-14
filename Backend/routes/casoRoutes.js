import express from 'express';
import {
  crearCasoCtrl,
  obtenerCasosCtrl,
  obtenerCasoPorIdCtrl,
  obtenerCasosPorEstudianteCtrl,
  obtenerCasosPorResponsableCtrl,
  obtenerCasosPorEstadoCtrl,
  actualizarCasoCtrl,
  cambiarEstadoCasoCtrl,
  cerrarCasoCtrl,
  obtenerCasosActivosCtrl,
  obtenerCasosPendientesCtrl,
  eliminarCasoCtrl,
  buscarCasosCtrl,
  obtenerEstadisticasCasosCtrl
} from '../controllers/casoController.js';

const router = express.Router();

// Rutas de casos
router.post('/', crearCasoCtrl);
router.get('/', obtenerCasosCtrl);
router.get('/buscar', buscarCasosCtrl);
router.get('/activos', obtenerCasosActivosCtrl);
router.get('/pendientes', obtenerCasosPendientesCtrl);
router.get('/estadisticas', obtenerEstadisticasCasosCtrl);
router.get('/estudiante/:studentId', obtenerCasosPorEstudianteCtrl);
router.get('/responsable/:responsableId', obtenerCasosPorResponsableCtrl);
router.get('/estado/:estado', obtenerCasosPorEstadoCtrl);
router.get('/:id', obtenerCasoPorIdCtrl);
router.put('/:id', actualizarCasoCtrl);
router.put('/:id/estado', cambiarEstadoCasoCtrl);
router.put('/:id/cerrar', cerrarCasoCtrl);
router.delete('/:id', eliminarCasoCtrl);

export default router; 