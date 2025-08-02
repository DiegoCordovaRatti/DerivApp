import express from 'express';
import {
  // Métodos de estudiantes
  crearEstudianteCtrl,
  obtenerEstudiantesCtrl,
  obtenerEstudiantePorIdCtrl,
  obtenerEstudiantePorRutCtrl,
  actualizarEstudianteCtrl,
  cambiarEstadoEstudianteCtrl,
  obtenerEstudiantesPorEstadoCtrl,
  obtenerEstudiantesPorEstablecimientoCtrl,
  obtenerEstudiantesActivosCtrl,
  eliminarEstudianteCtrl,
  buscarEstudiantesCtrl,
  // Métodos de derivaciones
  crearDerivacionCtrl,
  obtenerDerivacionesEstudianteCtrl,
  obtenerDerivacionPorIdCtrl,
  actualizarDerivacionCtrl,
  eliminarDerivacionCtrl,
  cambiarEstadoDerivacionCtrl,
  obtenerDerivacionesPorEstadoCtrl,
  obtenerDerivacionesRecientesCtrl,
  // Métodos de seguimientos
  crearSeguimientoCtrl,
  obtenerSeguimientosDerivacionCtrl,
  obtenerSeguimientoPorIdCtrl,
  actualizarSeguimientoCtrl,
  eliminarSeguimientoCtrl
} from '../controllers/estudianteController.js';

const router = express.Router();

// ===== RUTAS DE ESTUDIANTES =====

// Rutas básicas de estudiantes
router.post('/', crearEstudianteCtrl);
router.get('/', obtenerEstudiantesCtrl);
router.get('/buscar', buscarEstudiantesCtrl);
router.get('/activos', obtenerEstudiantesActivosCtrl);
router.get('/estado/:estado', obtenerEstudiantesPorEstadoCtrl);
router.get('/establecimiento/:establecimientoId', obtenerEstudiantesPorEstablecimientoCtrl);
router.get('/rut/:rut', obtenerEstudiantePorRutCtrl);
router.get('/:id', obtenerEstudiantePorIdCtrl);
router.put('/:id', actualizarEstudianteCtrl);
router.patch('/:id/estado', cambiarEstadoEstudianteCtrl);
router.delete('/:id', eliminarEstudianteCtrl);

// ===== RUTAS DE DERIVACIONES =====

// Rutas de derivaciones por estudiante
router.post('/:estudianteId/derivaciones', crearDerivacionCtrl);
router.get('/:estudianteId/derivaciones', obtenerDerivacionesEstudianteCtrl);
router.get('/:estudianteId/derivaciones/:derivacionId', obtenerDerivacionPorIdCtrl);
router.put('/:estudianteId/derivaciones/:derivacionId', actualizarDerivacionCtrl);
router.patch('/:estudianteId/derivaciones/:derivacionId/estado', cambiarEstadoDerivacionCtrl);
router.delete('/:estudianteId/derivaciones/:derivacionId', eliminarDerivacionCtrl);

// ===== RUTAS DE SEGUIMIENTOS =====

// Rutas de seguimientos por derivación
router.post('/:estudianteId/derivaciones/:derivacionId/seguimientos', crearSeguimientoCtrl);
router.get('/:estudianteId/derivaciones/:derivacionId/seguimientos', obtenerSeguimientosDerivacionCtrl);
router.get('/:estudianteId/derivaciones/:derivacionId/seguimientos/:seguimientoId', obtenerSeguimientoPorIdCtrl);
router.put('/:estudianteId/derivaciones/:derivacionId/seguimientos/:seguimientoId', actualizarSeguimientoCtrl);
router.delete('/:estudianteId/derivaciones/:derivacionId/seguimientos/:seguimientoId', eliminarSeguimientoCtrl);

export default router; 