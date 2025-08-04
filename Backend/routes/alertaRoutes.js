import express from 'express';
import { obtenerTodasLasAlertas } from '../controllers/alertaController.js';

const router = express.Router();

// Obtener todas las alertas
router.get('/', obtenerTodasLasAlertas);

export default router; 