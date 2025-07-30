import {
  crearCitacion,
  obtenerCitaciones,
  obtenerCitacionPorId,
  actualizarCitacion,
  eliminarCitacion,
  obtenerCitacionesPorEstudiante,
  obtenerCitacionesPorEstado,
  obtenerCitacionesPorTipo,
  obtenerCitacionesPendientes,
  obtenerCitacionesHoy,
  marcarCitacionRealizada,
  reprogramarCitacion
} from '../models/Citacion.js';

// Crear una nueva citación
export const crearCitacionCtrl = async (req, res) => {
  try {
    const nuevaCitacion = await crearCitacion(req.body);
    
    res.status(201).json({
      message: 'Citación creada exitosamente',
      citacion: nuevaCitacion
    });
  } catch (error) {
    console.error('Error al crear citación:', error);
    res.status(400).json({
      error: 'Error al crear citación',
      details: error.message
    });
  }
};

// Obtener todas las citaciones
export const obtenerCitacionesCtrl = async (req, res) => {
  try {
    const citaciones = await obtenerCitaciones();
    
    res.json({
      citaciones,
      total: citaciones.length
    });
  } catch (error) {
    console.error('Error al obtener citaciones:', error);
    res.status(500).json({
      error: 'Error al obtener citaciones',
      details: error.message
    });
  }
};

// Obtener citación por ID
export const obtenerCitacionPorIdCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const citacion = await obtenerCitacionPorId(id);
    
    res.json({
      citacion
    });
  } catch (error) {
    console.error('Error al obtener citación:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Citación no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al obtener citación',
      details: error.message
    });
  }
};

// Actualizar citación
export const actualizarCitacionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const citacionActualizada = await actualizarCitacion(id, req.body);
    
    res.json({
      message: 'Citación actualizada exitosamente',
      citacion: citacionActualizada
    });
  } catch (error) {
    console.error('Error al actualizar citación:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Citación no encontrada'
      });
    }
    res.status(400).json({
      error: 'Error al actualizar citación',
      details: error.message
    });
  }
};

// Eliminar citación
export const eliminarCitacionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await eliminarCitacion(id);
    
    res.json({
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al eliminar citación:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Citación no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al eliminar citación',
      details: error.message
    });
  }
};

// Obtener citaciones por estudiante
export const obtenerCitacionesPorEstudianteCtrl = async (req, res) => {
  try {
    const { estudianteId } = req.params;
    const citaciones = await obtenerCitacionesPorEstudiante(estudianteId);
    
    res.json({
      citaciones,
      total: citaciones.length,
      estudianteId
    });
  } catch (error) {
    console.error('Error al obtener citaciones del estudiante:', error);
    res.status(500).json({
      error: 'Error al obtener citaciones del estudiante',
      details: error.message
    });
  }
};

// Obtener citaciones por estado
export const obtenerCitacionesPorEstadoCtrl = async (req, res) => {
  try {
    const { estado } = req.params;
    
    if (!['pendiente', 'realizada', 'reprogramada'].includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido. Debe ser: pendiente, realizada o reprogramada'
      });
    }
    
    const citaciones = await obtenerCitacionesPorEstado(estado);
    
    res.json({
      citaciones,
      total: citaciones.length,
      estado
    });
  } catch (error) {
    console.error('Error al obtener citaciones por estado:', error);
    res.status(500).json({
      error: 'Error al obtener citaciones por estado',
      details: error.message
    });
  }
};

// Obtener citaciones por tipo
export const obtenerCitacionesPorTipoCtrl = async (req, res) => {
  try {
    const { tipo } = req.params;
    
    if (!['visita_domiciliaria', 'cita_en_escuela'].includes(tipo)) {
      return res.status(400).json({
        error: 'Tipo inválido. Debe ser: visita_domiciliaria o cita_en_escuela'
      });
    }
    
    const citaciones = await obtenerCitacionesPorTipo(tipo);
    
    res.json({
      citaciones,
      total: citaciones.length,
      tipo
    });
  } catch (error) {
    console.error('Error al obtener citaciones por tipo:', error);
    res.status(500).json({
      error: 'Error al obtener citaciones por tipo',
      details: error.message
    });
  }
};

// Obtener citaciones pendientes
export const obtenerCitacionesPendientesCtrl = async (req, res) => {
  try {
    const citaciones = await obtenerCitacionesPendientes();
    
    res.json({
      citaciones,
      total: citaciones.length
    });
  } catch (error) {
    console.error('Error al obtener citaciones pendientes:', error);
    res.status(500).json({
      error: 'Error al obtener citaciones pendientes',
      details: error.message
    });
  }
};

// Obtener citaciones de hoy
export const obtenerCitacionesHoyCtrl = async (req, res) => {
  try {
    const citaciones = await obtenerCitacionesHoy();
    
    res.json({
      citaciones,
      total: citaciones.length,
      fecha: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error al obtener citaciones de hoy:', error);
    res.status(500).json({
      error: 'Error al obtener citaciones de hoy',
      details: error.message
    });
  }
};

// Marcar citación como realizada
export const marcarCitacionRealizadaCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { observaciones } = req.body;
    
    const resultado = await marcarCitacionRealizada(id, observaciones);
    
    res.json({
      message: resultado.message,
      citacion: resultado.citacion
    });
  } catch (error) {
    console.error('Error al marcar citación como realizada:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Citación no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al marcar citación como realizada',
      details: error.message
    });
  }
};

// Reprogramar citación
export const reprogramarCitacionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevaFecha, motivo } = req.body;
    
    if (!nuevaFecha) {
      return res.status(400).json({
        error: 'Nueva fecha es requerida'
      });
    }
    
    const resultado = await reprogramarCitacion(id, nuevaFecha, motivo);
    
    res.json({
      message: resultado.message,
      citacion: resultado.citacion
    });
  } catch (error) {
    console.error('Error al reprogramar citación:', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        error: 'Citación no encontrada'
      });
    }
    res.status(500).json({
      error: 'Error al reprogramar citación',
      details: error.message
    });
  }
};

// Buscar citaciones
export const buscarCitacionesCtrl = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'El término de búsqueda debe tener al menos 2 caracteres'
      });
    }
    
    const citaciones = await obtenerCitaciones();
    const terminoBusqueda = q.toLowerCase();
    
    const citacionesFiltradas = citaciones.filter(citacion => 
      citacion.motivo?.toLowerCase().includes(terminoBusqueda) ||
      citacion.estudianteId?.toLowerCase().includes(terminoBusqueda) ||
      citacion.tipo?.toLowerCase().includes(terminoBusqueda)
    );
    
    res.json({
      citaciones: citacionesFiltradas,
      total: citacionesFiltradas.length,
      terminoBusqueda: q
    });
  } catch (error) {
    console.error('Error al buscar citaciones:', error);
    res.status(500).json({
      error: 'Error al buscar citaciones',
      details: error.message
    });
  }
};

export default {
  crearCitacionCtrl,
  obtenerCitacionesCtrl,
  obtenerCitacionPorIdCtrl,
  actualizarCitacionCtrl,
  eliminarCitacionCtrl,
  obtenerCitacionesPorEstudianteCtrl,
  obtenerCitacionesPorEstadoCtrl,
  obtenerCitacionesPorTipoCtrl,
  obtenerCitacionesPendientesCtrl,
  obtenerCitacionesHoyCtrl,
  marcarCitacionRealizadaCtrl,
  reprogramarCitacionCtrl,
  buscarCitacionesCtrl
}; 