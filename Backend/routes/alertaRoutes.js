import express from 'express';
import { obtenerTodasLasAlertas, marcarAlertaComoLeida, marcarTodasAlertasComoLeidas, apagarAlerta, activarAlerta, migrarAlertas } from '../controllers/alertaController.js';

const router = express.Router();

// Obtener todas las alertas
router.get('/', obtenerTodasLasAlertas);

// Marcar alerta como leída
router.patch('/:id/marcar-leida', marcarAlertaComoLeida);

// Marcar todas las alertas como leídas
router.patch('/marcar-todas-leidas', marcarTodasAlertasComoLeidas);

// Apagar alerta (desactivar)
router.patch('/:estudianteId/:derivacionId/:alertaId/apagar', apagarAlerta);

// Activar alerta
router.patch('/:estudianteId/:derivacionId/:alertaId/activar', activarAlerta);

// Migrar alertas existentes (temporal)
router.post('/migrar', migrarAlertas);

export default router; 