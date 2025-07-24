import express from 'express';
import {
  crearInformeCtrl,
  obtenerInformesCtrl,
  obtenerInformePorIdCtrl,
  obtenerInformesPorCasoCtrl,
  obtenerInformesPorAutorCtrl,
  actualizarInformeCtrl,
  eliminarInformeCtrl
} from '../controllers/informeController.js';

const router = express.Router();

// Rutas de informes
router.post('/', crearInformeCtrl);
router.get('/', obtenerInformesCtrl);
router.get('/caso/:caseId', obtenerInformesPorCasoCtrl);
router.get('/autor/:autorId', obtenerInformesPorAutorCtrl);
router.get('/:id', obtenerInformePorIdCtrl);
router.put('/:id', actualizarInformeCtrl);
router.delete('/:id', eliminarInformeCtrl);

export default router; 