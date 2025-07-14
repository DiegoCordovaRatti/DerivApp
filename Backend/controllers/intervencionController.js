import {
  crearIntervencion,
  obtenerIntervenciones,
  obtenerIntervencionPorId,
  obtenerIntervencionesPorCaso,
  obtenerIntervencionesPorProfesional,
  actualizarIntervencion,
  eliminarIntervencion
} from '../models/Intervencion.js';

// Crear una nueva intervención
export const crearIntervencionCtrl = async (req, res) => {
  try {
    const nuevaIntervencion = await crearIntervencion(req.body);
    
    res.status(201).json({
      message: 'Intervención creada exitosamente',
      intervencion: nuevaIntervencion
    });
  } catch (error) {
    console.error('Error al crear intervención:', error);
    res.status(400).json({
      error: 'Error al crear intervención',
      details: error.message
    });
  }
};

// Obtener todas las intervenciones
export const obtenerIntervencionesCtrl = async (req, res) => {
  try {
    const intervenciones = await obtenerIntervenciones();
    
    res.json({
      intervenciones,
      total: intervenciones.length
    });
  } catch (error) {
    console.error('Error al obtener intervenciones:', error);
    res.status(500).json({
      error: 'Error al obtener intervenciones',
      details: error.message
    });
  }
};

// Obtener intervención por ID
export const obtenerIntervencionPorIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const intervencion = await obtenerIntervencionPorId(id);
    
    res.json({
      intervencion
    });
  } catch (error) {
    console.error('Error al obtener intervención:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Intervención no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al obtener intervención',
      details: error.message
    });
  }
};

// Obtener intervenciones por caso
export const obtenerIntervencionesPorCasoCtrl = async (req, res) => {
  try {
    const { caseId } = req.params;
    const intervenciones = await obtenerIntervencionesPorCaso(caseId);
    
    res.json({
      intervenciones,
      total: intervenciones.length,
      caseId
    });
  } catch (error) {
    console.error('Error al obtener intervenciones del caso:', error);
    res.status(500).json({
      error: 'Error al obtener intervenciones del caso',
      details: error.message
    });
  }
};

// Obtener intervenciones por profesional
export const obtenerIntervencionesPorProfesionalCtrl = async (req, res) => {
  try {
    const { realizadaPor } = req.params;
    const intervenciones = await obtenerIntervencionesPorProfesional(realizadaPor);
    
    res.json({
      intervenciones,
      total: intervenciones.length,
      realizadaPor
    });
  } catch (error) {
    console.error('Error al obtener intervenciones del profesional:', error);
    res.status(500).json({
      error: 'Error al obtener intervenciones del profesional',
      details: error.message
    });
  }
};

// Actualizar intervención
export const actualizarIntervencionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const intervencionActualizada = await actualizarIntervencion(id, req.body);
    
    res.json({
      message: 'Intervención actualizada exitosamente',
      intervencion: intervencionActualizada
    });
  } catch (error) {
    console.error('Error al actualizar intervención:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Intervención no encontrada'
      });
    }
    res.status(400).json({
      error: 'Error al actualizar intervención',
      details: error.message
    });
  }
};

// Eliminar intervención
export const eliminarIntervencionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await eliminarIntervencion(id);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al eliminar intervención:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Intervención no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al eliminar intervención',
      details: error.message
    });
  }
};

export default {
  crearIntervencionCtrl,
  obtenerIntervencionesCtrl,
  obtenerIntervencionPorIdCtrl,
  obtenerIntervencionesPorCasoCtrl,
  obtenerIntervencionesPorProfesionalCtrl,
  actualizarIntervencionCtrl,
  eliminarIntervencionCtrl
}; 