import express from 'express';
import {
  crearAlerta,
  obtenerAlertasDerivacion,
  obtenerAlertaPorId,
  actualizarAlerta,
  eliminarAlerta,
  obtenerAlertaReciente
} from '../models/Estudiante.js';

const router = express.Router();

// Crear una nueva alerta para una derivación
router.post('/estudiantes/:estudianteId/derivaciones/:derivacionId/alertas', async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    const datosAlerta = req.body;
    
    const alerta = await crearAlerta(estudianteId, derivacionId, datosAlerta);
    res.status(201).json(alerta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las alertas de una derivación
router.get('/estudiantes/:estudianteId/derivaciones/:derivacionId/alertas', async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    
    const alertas = await obtenerAlertasDerivacion(estudianteId, derivacionId);
    res.json({ alertas });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener una alerta específica
router.get('/estudiantes/:estudianteId/derivaciones/:derivacionId/alertas/:alertaId', async (req, res) => {
  try {
    const { estudianteId, derivacionId, alertaId } = req.params;
    
    const alerta = await obtenerAlertaPorId(estudianteId, derivacionId, alertaId);
    res.json(alerta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar una alerta
router.put('/estudiantes/:estudianteId/derivaciones/:derivacionId/alertas/:alertaId', async (req, res) => {
  try {
    const { estudianteId, derivacionId, alertaId } = req.params;
    const datosActualizados = req.body;
    
    const resultado = await actualizarAlerta(estudianteId, derivacionId, alertaId, datosActualizados);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una alerta
router.delete('/estudiantes/:estudianteId/derivaciones/:derivacionId/alertas/:alertaId', async (req, res) => {
  try {
    const { estudianteId, derivacionId, alertaId } = req.params;
    
    const resultado = await eliminarAlerta(estudianteId, derivacionId, alertaId);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener la alerta más reciente de una derivación
router.get('/estudiantes/:estudianteId/derivaciones/:derivacionId/alertas/reciente', async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    
    const alerta = await obtenerAlertaReciente(estudianteId, derivacionId);
    res.json(alerta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 