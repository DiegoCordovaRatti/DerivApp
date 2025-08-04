import express from 'express';
import { obtenerEstadisticasDashboard, obtenerAlertasRecientes, obtenerEventosProximos } from '../controllers/dashboardController.js';

const router = express.Router();

// Obtener estadísticas generales del dashboard
router.get('/estadisticas', obtenerEstadisticasDashboard);

// Obtener alertas recientes
router.get('/alertas-recientes', obtenerAlertasRecientes);

// Obtener eventos próximos
router.get('/eventos-proximos', obtenerEventosProximos);

export default router; 