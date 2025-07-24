import express from 'express';
import {
  crearAlertaCtrl,
  obtenerAlertasCtrl,
  obtenerAlertaPorIdCtrl,
  obtenerAlertasPorCasoCtrl,
  obtenerAlertasNoResueltasCtrl,
  actualizarAlertaCtrl,
  resolverAlertaCtrl,
  eliminarAlertaCtrl
} from '../controllers/alertaController.js';

const router = express.Router();

// Rutas de alertas
router.post('/', crearAlertaCtrl);
router.get('/', obtenerAlertasCtrl);
router.get('/no-resueltas', obtenerAlertasNoResueltasCtrl);
router.get('/caso/:caseId', obtenerAlertasPorCasoCtrl);
router.get('/:id', obtenerAlertaPorIdCtrl);
router.put('/:id', actualizarAlertaCtrl);
router.put('/:id/resolver', resolverAlertaCtrl);
router.delete('/:id', eliminarAlertaCtrl);

export default router;
