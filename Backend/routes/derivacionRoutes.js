import express from 'express';
import {
  obtenerDerivacionesPorEstadoCtrl,
  obtenerDerivacionesRecientesCtrl
} from '../controllers/estudianteController.js';

const router = express.Router();

// ===== RUTAS GLOBALES DE DERIVACIONES =====

// Obtener derivaciones por estado
router.get('/estado/:estado', obtenerDerivacionesPorEstadoCtrl);

// Obtener derivaciones recientes
router.get('/recientes', obtenerDerivacionesRecientesCtrl);

export default router; 