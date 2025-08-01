import express from 'express';
import {
  obtenerDerivacionesPorEstadoCtrl,
  obtenerDerivacionesRecientesCtrl
} from '../controllers/estudianteController.js';

const router = express.Router();

// Rutas para derivaciones globales
router.get('/recientes', obtenerDerivacionesRecientesCtrl);
router.get('/estado/:estado', obtenerDerivacionesPorEstadoCtrl);

export default router; 