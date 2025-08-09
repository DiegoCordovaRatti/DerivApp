import express from 'express';
import {
  obtenerDerivacionesPorEstadoCtrl,
  obtenerDerivacionesRecientesCtrl,
  obtenerTodasDerivacionesCtrl
} from '../controllers/estudianteController.js';
import eventoRoutes from './eventoRoutes.js';

const router = express.Router();

// Rutas para derivaciones globales
router.get('/recientes', obtenerDerivacionesRecientesCtrl);
router.get('/estado/:estado', obtenerDerivacionesPorEstadoCtrl);
router.get('/', obtenerTodasDerivacionesCtrl);

// Rutas de eventos como subcolección de derivaciones
router.use('/:derivacionId/eventos', (req, res, next) => {
  // Pasar el derivacionId al router hijo
  req.derivacionId = req.params.derivacionId;
  next();
}, eventoRoutes);

export default router; 