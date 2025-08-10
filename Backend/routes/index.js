import express from 'express';
import authRoutes from './authRoutes.js';
import estudianteRoutes from './estudianteRoutes.js';
import establecimientoRoutes from './establecimientoRoutes.js';
import citacionRoutes from './citacionRoutes.js';
import formularioRoutes from './formularioRoutes.js';
import actividadRoutes from './actividadRoutes.js';
import intervencionRoutes from './intervencionRoutes.js';
import derivacionRoutes from './derivacionRoutes.js';
import alertaRoutes from './alertaRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import eventoRoutes from './eventoRoutes.js';

const router = express.Router();

// Rutas principales
router.use('/auth', authRoutes);
router.use('/estudiantes', estudianteRoutes);
router.use('/establecimientos', establecimientoRoutes);
router.use('/citaciones', citacionRoutes);
router.use('/formularios', formularioRoutes);
router.use('/actividades', actividadRoutes);
router.use('/intervenciones', intervencionRoutes);
router.use('/derivaciones', derivacionRoutes);
router.use('/alertas', alertaRoutes);
router.use('/dashboard', dashboardRoutes);
// Los eventos ahora son subcolección de derivaciones
// router.use('/eventos', eventoRoutes);

// Rutas globales para eventos (de todas las derivaciones) - para la vista de Agenda
router.get('/eventos/todas-derivaciones', (req, res) => {
  // Importar dinámicamente para evitar dependencias circulares
  import('../controllers/eventoController.js').then(({ obtenerEventosTodasDerivacionesController }) => {
    obtenerEventosTodasDerivacionesController(req, res);
  });
});

router.get('/eventos/proximos-todas-derivaciones', (req, res) => {
  import('../controllers/eventoController.js').then(({ obtenerEventosProximosTodasDerivacionesController }) => {
    obtenerEventosProximosTodasDerivacionesController(req, res);
  });
});

router.get('/eventos/estadisticas-todas-derivaciones', (req, res) => {
  import('../controllers/eventoController.js').then(({ obtenerEstadisticasEventosTodasDerivacionesController }) => {
    obtenerEstadisticasEventosTodasDerivacionesController(req, res);
  });
});

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({
    message: 'API DerivApp funcionando correctamente',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      estudiantes: '/api/estudiantes',
      establecimientos: '/api/establecimientos',
      citaciones: '/api/citaciones',
      formularios: '/api/formularios',
      actividades: '/api/actividades',
      intervenciones: '/api/intervenciones',
      derivaciones: '/api/derivaciones',
      alertas: '/api/alertas',
      dashboard: '/api/dashboard',
      eventos: '/api/eventos'
    },
    estructura: {
      estudiantes: {
        derivaciones: '/api/estudiantes/:estudianteId/derivaciones',
        intervenciones: '/api/estudiantes/:estudianteId/derivaciones/:derivacionId/intervenciones'
      },
      establecimientos: {
        equipo: '/api/establecimientos/:id/equipo'
      },
      eventos: {
        proximos: '/api/derivaciones/:derivacionId/eventos/proximos',
        estadisticas: '/api/derivaciones/:derivacionId/eventos/estadisticas',
        desdeAlerta: '/api/derivaciones/:derivacionId/eventos/desde-alerta'
      }
    }
  });
});

export default router;
