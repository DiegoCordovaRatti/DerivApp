import {
  crearAlerta,
  obtenerAlertas,
  obtenerAlertaPorId,
  obtenerAlertasPorCaso,
  obtenerAlertasNoResueltas,
  actualizarAlerta,
  resolverAlerta,
  eliminarAlerta
} from '../models/Alerta.js';

// Crear una nueva alerta
export const crearAlertaCtrl = async (req, res) => {
  try {
    const nuevaAlerta = await crearAlerta(req.body);
    
    res.status(201).json({
      message: 'Alerta creada exitosamente',
      alerta: nuevaAlerta
    });
  } catch (error) {
    console.error('Error al crear alerta:', error);
    res.status(400).json({
      error: 'Error al crear alerta',
      details: error.message
    });
  }
};

// Obtener todas las alertas
export const obtenerAlertasCtrl = async (req, res) => {
  try {
    const alertas = await obtenerAlertas();
    
    res.json({
      alertas,
      total: alertas.length
    });
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({
      error: 'Error al obtener alertas',
      details: error.message
    });
  }
};

// Obtener alerta por ID
export const obtenerAlertaPorIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const alerta = await obtenerAlertaPorId(id);
    
    res.json({
      alerta
    });
  } catch (error) {
    console.error('Error al obtener alerta:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Alerta no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al obtener alerta',
      details: error.message
    });
  }
};

// Obtener alertas por caso
export const obtenerAlertasPorCasoCtrl = async (req, res) => {
  try {
    const { caseId } = req.params;
    const alertas = await obtenerAlertasPorCaso(caseId);
    
    res.json({
      alertas,
      total: alertas.length,
      caseId
    });
  } catch (error) {
    console.error('Error al obtener alertas del caso:', error);
    res.status(500).json({
      error: 'Error al obtener alertas del caso',
      details: error.message
    });
  }
};

// Obtener alertas no resueltas
export const obtenerAlertasNoResueltasCtrl = async (req, res) => {
  try {
    const alertas = await obtenerAlertasNoResueltas();
    
    res.json({
      alertas,
      total: alertas.length
    });
  } catch (error) {
    console.error('Error al obtener alertas no resueltas:', error);
    res.status(500).json({
      error: 'Error al obtener alertas no resueltas',
      details: error.message
    });
  }
};

// Actualizar alerta
export const actualizarAlertaCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const alertaActualizada = await actualizarAlerta(id, req.body);
    
    res.json({
      message: 'Alerta actualizada exitosamente',
      alerta: alertaActualizada
    });
  } catch (error) {
    console.error('Error al actualizar alerta:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Alerta no encontrada'
      });
    }
    res.status(400).json({
      error: 'Error al actualizar alerta',
      details: error.message
    });
  }
};

// Resolver alerta
export const resolverAlertaCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { resueltaPor } = req.body;
    
    const resultado = await resolverAlerta(id, resueltaPor);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al resolver alerta:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Alerta no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al resolver alerta',
      details: error.message
    });
  }
};

// Eliminar alerta
export const eliminarAlertaCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await eliminarAlerta(id);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al eliminar alerta:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Alerta no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al eliminar alerta',
      details: error.message
    });
  }
};

export default {
  crearAlertaCtrl,
  obtenerAlertasCtrl,
  obtenerAlertaPorIdCtrl,
  obtenerAlertasPorCasoCtrl,
  obtenerAlertasNoResueltasCtrl,
  actualizarAlertaCtrl,
  resolverAlertaCtrl,
  eliminarAlertaCtrl
};
