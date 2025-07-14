import express from 'express';
import {
  crearIntervencionCtrl,
  obtenerIntervencionesCtrl,
  obtenerIntervencionPorIdCtrl,
  obtenerIntervencionesPorCasoCtrl,
  obtenerIntervencionesPorProfesionalCtrl,
  actualizarIntervencionCtrl,
  eliminarIntervencionCtrl
} from '../controllers/intervencionController.js';

const router = express.Router();

// Rutas de intervenciones
router.post('/', crearIntervencionCtrl);
router.get('/', obtenerIntervencionesCtrl);
router.get('/caso/:caseId', obtenerIntervencionesPorCasoCtrl);
router.get('/profesional/:realizadaPor', obtenerIntervencionesPorProfesionalCtrl);
router.get('/:id', obtenerIntervencionPorIdCtrl);
router.put('/:id', actualizarIntervencionCtrl);
router.delete('/:id', eliminarIntervencionCtrl);

export default router; 