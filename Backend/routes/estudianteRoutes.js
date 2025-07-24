import express from 'express';
import {
  crearEstudianteCtrl,
  obtenerEstudiantesCtrl,
  obtenerEstudiantePorIdCtrl,
  obtenerEstudiantePorRutCtrl,
  actualizarEstudianteCtrl,
  agregarNotaEstudianteCtrl,
  cambiarEstadoEstudianteCtrl,
  obtenerEstudiantesPorEstadoCtrl,
  obtenerEstudiantesActivosCtrl,
  eliminarEstudianteCtrl,
  buscarEstudiantesCtrl
} from '../controllers/estudianteController.js';

const router = express.Router();

// Rutas de estudiantes
router.post('/', crearEstudianteCtrl);
router.get('/', obtenerEstudiantesCtrl);
router.get('/buscar', buscarEstudiantesCtrl);
router.get('/activos', obtenerEstudiantesActivosCtrl);
router.get('/estado/:estado', obtenerEstudiantesPorEstadoCtrl);
router.get('/rut/:rut', obtenerEstudiantePorRutCtrl);
router.get('/:id', obtenerEstudiantePorIdCtrl);
router.put('/:id', actualizarEstudianteCtrl);
router.post('/:id/notas', agregarNotaEstudianteCtrl);
router.put('/:id/estado', cambiarEstadoEstudianteCtrl);
router.delete('/:id', eliminarEstudianteCtrl);

export default router; 