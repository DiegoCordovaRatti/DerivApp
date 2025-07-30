import {
  crearIntervencion,
  obtenerIntervencionesDerivacion,
  obtenerIntervencionPorId,
  obtenerTodasIntervenciones,
  obtenerIntervencionesPorTipo,
  obtenerIntervencionesPorProfesional,
  obtenerIntervencionesPorFecha,
  actualizarIntervencion,
  obtenerContactos,
  obtenerVisitas,
  obtenerActualizaciones,
  obtenerInformes,
  obtenerIntervencionesRecientes,
  eliminarIntervencion,
  obtenerEstadisticasIntervenciones
} from '../models/Intervencion.js';

// Crear una nueva intervención (entrada en historial)
export const crearIntervencionCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    const nuevaIntervencion = await crearIntervencion(estudianteId, derivacionId, req.body);
    
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

// Obtener todas las intervenciones de una derivación
export const obtenerIntervencionesDerivacionCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    const intervenciones = await obtenerIntervencionesDerivacion(estudianteId, derivacionId);
    
    res.json({
      intervenciones,
      total: intervenciones.length,
      estudianteId,
      derivacionId
    });
  } catch (error) {
    console.error('Error al obtener intervenciones de la derivación:', error);
    res.status(500).json({
      error: 'Error al obtener intervenciones',
      details: error.message
    });
  }
};

// Obtener todas las intervenciones (global)
export const obtenerTodasIntervencionesCtrl = async (req, res) => {
  try {
    const intervenciones = await obtenerTodasIntervenciones();
    
    res.json({
      intervenciones,
      total: intervenciones.length
    });
  } catch (error) {
    console.error('Error al obtener todas las intervenciones:', error);
    res.status(500).json({
      error: 'Error al obtener intervenciones',
      details: error.message
    });
  }
};

// Obtener intervención por ID
export const obtenerIntervencionPorIdCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId, intervencionId } = req.params;
    const intervencion = await obtenerIntervencionPorId(estudianteId, derivacionId, intervencionId);
    
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

// Obtener intervenciones por tipo
export const obtenerIntervencionesPorTipoCtrl = async (req, res) => {
  try {
    const { tipo } = req.params;
    
    if (!['contacto', 'visita', 'actualización', 'informe'].includes(tipo)) {
      return res.status(400).json({
        error: 'Tipo inválido. Debe ser: contacto, visita, actualización o informe'
      });
    }
    
    const intervenciones = await obtenerIntervencionesPorTipo(tipo);
    
    res.json({
      intervenciones,
      total: intervenciones.length,
      tipo
    });
  } catch (error) {
    console.error('Error al obtener intervenciones por tipo:', error);
    res.status(500).json({
      error: 'Error al obtener intervenciones por tipo',
      details: error.message
    });
  }
};

// Obtener intervenciones por profesional
export const obtenerIntervencionesPorProfesionalCtrl = async (req, res) => {
  try {
    const { creadoPor } = req.params;
    const intervenciones = await obtenerIntervencionesPorProfesional(creadoPor);
    
    res.json({
      intervenciones,
      total: intervenciones.length,
      creadoPor
    });
  } catch (error) {
    console.error('Error al obtener intervenciones del profesional:', error);
    res.status(500).json({
      error: 'Error al obtener intervenciones del profesional',
      details: error.message
    });
  }
};

// Obtener intervenciones por fecha
export const obtenerIntervencionesPorFechaCtrl = async (req, res) => {
  try {
    const { fecha } = req.params;
    
    if (!fecha) {
      return res.status(400).json({
        error: 'Fecha es requerida'
      });
    }
    
    const intervenciones = await obtenerIntervencionesPorFecha(fecha);
    
    res.json({
      intervenciones,
      total: intervenciones.length,
      fecha
    });
  } catch (error) {
    console.error('Error al obtener intervenciones por fecha:', error);
    res.status(500).json({
      error: 'Error al obtener intervenciones por fecha',
      details: error.message
    });
  }
};

// Actualizar intervención
export const actualizarIntervencionCtrl = async (req, res) => {
  try {
    const { estudianteId, derivacionId, intervencionId } = req.params;
    const intervencionActualizada = await actualizarIntervencion(estudianteId, derivacionId, intervencionId, req.body);
    
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
    const { estudianteId, derivacionId, intervencionId } = req.params;
    const resultado = await eliminarIntervencion(estudianteId, derivacionId, intervencionId);
    
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

// Obtener contactos
export const obtenerContactosCtrl = async (req, res) => {
  try {
    const contactos = await obtenerContactos();
    
    res.json({
      contactos,
      total: contactos.length
    });
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    res.status(500).json({
      error: 'Error al obtener contactos',
      details: error.message
    });
  }
};

// Obtener visitas
export const obtenerVisitasCtrl = async (req, res) => {
  try {
    const visitas = await obtenerVisitas();
    
    res.json({
      visitas,
      total: visitas.length
    });
  } catch (error) {
    console.error('Error al obtener visitas:', error);
    res.status(500).json({
      error: 'Error al obtener visitas',
      details: error.message
    });
  }
};

// Obtener actualizaciones
export const obtenerActualizacionesCtrl = async (req, res) => {
  try {
    const actualizaciones = await obtenerActualizaciones();
    
    res.json({
      actualizaciones,
      total: actualizaciones.length
    });
  } catch (error) {
    console.error('Error al obtener actualizaciones:', error);
    res.status(500).json({
      error: 'Error al obtener actualizaciones',
      details: error.message
    });
  }
};

// Obtener informes
export const obtenerInformesCtrl = async (req, res) => {
  try {
    const informes = await obtenerInformes();
    
    res.json({
      informes,
      total: informes.length
    });
  } catch (error) {
    console.error('Error al obtener informes:', error);
    res.status(500).json({
      error: 'Error al obtener informes',
      details: error.message
    });
  }
};

// Obtener intervenciones recientes
export const obtenerIntervencionesRecientesCtrl = async (req, res) => {
  try {
    const { limite = 10 } = req.query;
    const intervenciones = await obtenerIntervencionesRecientes(parseInt(limite));
    
    res.json({
      intervenciones,
      total: intervenciones.length,
      limite: parseInt(limite)
    });
  } catch (error) {
    console.error('Error al obtener intervenciones recientes:', error);
    res.status(500).json({
      error: 'Error al obtener intervenciones recientes',
      details: error.message
    });
  }
};

// Obtener estadísticas de intervenciones
export const obtenerEstadisticasIntervencionesCtrl = async (req, res) => {
  try {
    const estadisticas = await obtenerEstadisticasIntervenciones();
    
    res.json({
      estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de intervenciones:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      details: error.message
    });
  }
};

export default {
  crearIntervencionCtrl,
  obtenerIntervencionesDerivacionCtrl,
  obtenerTodasIntervencionesCtrl,
  obtenerIntervencionPorIdCtrl,
  obtenerIntervencionesPorTipoCtrl,
  obtenerIntervencionesPorProfesionalCtrl,
  obtenerIntervencionesPorFechaCtrl,
  actualizarIntervencionCtrl,
  eliminarIntervencionCtrl,
  obtenerContactosCtrl,
  obtenerVisitasCtrl,
  obtenerActualizacionesCtrl,
  obtenerInformesCtrl,
  obtenerIntervencionesRecientesCtrl,
  obtenerEstadisticasIntervencionesCtrl
}; 