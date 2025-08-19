import express from 'express';
import { obtenerTodasLasAlertas, marcarAlertaComoLeida, marcarTodasAlertasComoLeidas } from '../controllers/alertaController.js';

const router = express.Router();

// Obtener todas las alertas
router.get('/', obtenerTodasLasAlertas);

// Marcar alerta como leída
router.patch('/:id/marcar-leida', marcarAlertaComoLeida);

// Marcar todas las alertas como leídas
router.patch('/marcar-todas-leidas', marcarTodasAlertasComoLeidas);

export default router; 