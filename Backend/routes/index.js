import express from 'express';
import authRoutes from './authRoutes.js';
import estudianteRoutes from './estudianteRoutes.js';
import casoRoutes from './casoRoutes.js';
import informeRoutes from './informeRoutes.js';
import alertaRoutes from './alertaRoutes.js';
import intervencionRoutes from './intervencionRoutes.js';

const router = express.Router();

// Rutas principales
router.use('/auth', authRoutes);
router.use('/estudiantes', estudianteRoutes);
router.use('/casos', casoRoutes);
router.use('/informes', informeRoutes);
router.use('/alertas', alertaRoutes);
router.use('/intervenciones', intervencionRoutes);

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({
    message: 'API DerivApp funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      estudiantes: '/api/estudiantes',
      casos: '/api/casos',
      informes: '/api/informes',
      alertas: '/api/alertas',
      intervenciones: '/api/intervenciones'
    }
  });
});

export default router;
