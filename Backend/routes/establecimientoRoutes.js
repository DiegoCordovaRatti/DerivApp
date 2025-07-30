import express from 'express';
import {
  crearEstablecimientoCtrl,
  obtenerEstablecimientosCtrl,
  obtenerEstablecimientoPorIdCtrl,
  actualizarEstablecimientoCtrl,
  eliminarEstablecimientoCtrl,
  agregarUsuarioAEquipoCtrl,
  removerUsuarioDeEquipoCtrl,
  obtenerEstablecimientosPorComunaCtrl,
  obtenerEstablecimientosPorRegionCtrl,
  buscarEstablecimientosCtrl
} from '../controllers/establecimientoController.js';

const router = express.Router();

// ===== RUTAS DE ESTABLECIMIENTOS =====

// Rutas básicas de establecimientos
router.post('/', crearEstablecimientoCtrl);
router.get('/', obtenerEstablecimientosCtrl);
router.get('/buscar', buscarEstablecimientosCtrl);
router.get('/comuna/:comuna', obtenerEstablecimientosPorComunaCtrl);
router.get('/region/:region', obtenerEstablecimientosPorRegionCtrl);
router.get('/:id', obtenerEstablecimientoPorIdCtrl);
router.put('/:id', actualizarEstablecimientoCtrl);
router.delete('/:id', eliminarEstablecimientoCtrl);

// ===== RUTAS DE EQUIPO PSICOSOCIAL =====

// Rutas de gestión del equipo psicosocial
router.post('/:id/equipo', agregarUsuarioAEquipoCtrl);
router.delete('/:id/equipo', removerUsuarioDeEquipoCtrl);

export default router; 