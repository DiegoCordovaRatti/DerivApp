import express from 'express';
import {
  crearCitacionCtrl,
  obtenerCitacionesCtrl,
  obtenerCitacionPorIdCtrl,
  actualizarCitacionCtrl,
  eliminarCitacionCtrl,
  obtenerCitacionesPorEstudianteCtrl,
  obtenerCitacionesPorEstadoCtrl,
  obtenerCitacionesPorTipoCtrl,
  obtenerCitacionesPendientesCtrl,
  obtenerCitacionesHoyCtrl,
  marcarCitacionRealizadaCtrl,
  reprogramarCitacionCtrl,
  buscarCitacionesCtrl
} from '../controllers/citacionController.js';

const router = express.Router();

// ===== RUTAS DE CITACIONES =====

// Rutas básicas de citaciones
router.post('/', crearCitacionCtrl);
router.get('/', obtenerCitacionesCtrl);
router.get('/buscar', buscarCitacionesCtrl);
router.get('/pendientes', obtenerCitacionesPendientesCtrl);
router.get('/hoy', obtenerCitacionesHoyCtrl);
router.get('/:id', obtenerCitacionPorIdCtrl);
router.put('/:id', actualizarCitacionCtrl);
router.delete('/:id', eliminarCitacionCtrl);

// ===== RUTAS DE FILTROS =====

// Rutas de filtros por estudiante
router.get('/estudiante/:estudianteId', obtenerCitacionesPorEstudianteCtrl);

// Rutas de filtros por estado
router.get('/estado/:estado', obtenerCitacionesPorEstadoCtrl);

// Rutas de filtros por tipo
router.get('/tipo/:tipo', obtenerCitacionesPorTipoCtrl);

// ===== RUTAS DE ACCIONES ESPECÍFICAS =====

// Rutas de acciones específicas
router.put('/:id/realizada', marcarCitacionRealizadaCtrl);
router.put('/:id/reprogramar', reprogramarCitacionCtrl);

export default router; 