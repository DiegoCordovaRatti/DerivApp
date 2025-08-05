import {
  crearEvento,
  obtenerEventos,
  obtenerEventoPorId,
  actualizarEvento,
  eliminarEvento,
  obtenerEventosPorEstudiante,
  obtenerEventosPorDerivacion,
  obtenerEventosProximos,
  obtenerEventosPorTipo,
  obtenerEventosPorPrioridad,
  crearEventoDesdeAlerta,
  obtenerEstadisticasEventos
} from '../models/Evento.js';

// Crear un nuevo evento
export const crearEventoController = async (req, res) => {
  try {
    const datosEvento = req.body;
    
    // Validar campos requeridos
    if (!datosEvento.titulo || !datosEvento.fecha || !datosEvento.tipo) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: título, fecha y tipo son obligatorios'
      });
    }

    const evento = await crearEvento(datosEvento);
    
    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      evento
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear evento',
      error: error.message
    });
  }
};

// Obtener todos los eventos
export const obtenerEventosController = async (req, res) => {
  try {
    const eventos = await obtenerEventos();
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos',
      error: error.message
    });
  }
};

// Obtener evento por ID
export const obtenerEventoPorIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await obtenerEventoPorId(id);
    
    res.json({
      success: true,
      evento
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(404).json({
      success: false,
      message: 'Evento no encontrado',
      error: error.message
    });
  }
};

// Actualizar evento
export const actualizarEventoController = async (req, res) => {
  try {
    const { id } = req.params;
    const datosEvento = req.body;
    
    const evento = await actualizarEvento(id, datosEvento);
    
    res.json({
      success: true,
      message: 'Evento actualizado exitosamente',
      evento
    });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar evento',
      error: error.message
    });
  }
};

// Eliminar evento
export const eliminarEventoController = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarEvento(id);
    
    res.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar evento',
      error: error.message
    });
  }
};

// Obtener eventos por estudiante
export const obtenerEventosPorEstudianteController = async (req, res) => {
  try {
    const { estudianteId } = req.params;
    const eventos = await obtenerEventosPorEstudiante(estudianteId);
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos del estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos del estudiante',
      error: error.message
    });
  }
};

// Obtener eventos por derivación
export const obtenerEventosPorDerivacionController = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    const eventos = await obtenerEventosPorDerivacion(estudianteId, derivacionId);
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos de la derivación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos de la derivación',
      error: error.message
    });
  }
};

// Obtener eventos próximos
export const obtenerEventosProximosController = async (req, res) => {
  try {
    const eventos = await obtenerEventosProximos();
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos próximos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos próximos',
      error: error.message
    });
  }
};

// Obtener eventos por tipo
export const obtenerEventosPorTipoController = async (req, res) => {
  try {
    const { tipo } = req.params;
    const eventos = await obtenerEventosPorTipo(tipo);
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos por tipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos por tipo',
      error: error.message
    });
  }
};

// Obtener eventos por prioridad
export const obtenerEventosPorPrioridadController = async (req, res) => {
  try {
    const { prioridad } = req.params;
    const eventos = await obtenerEventosPorPrioridad(prioridad);
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos por prioridad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos por prioridad',
      error: error.message
    });
  }
};

// Crear evento desde alerta
export const crearEventoDesdeAlertaController = async (req, res) => {
  try {
    const { alerta, datosEvento } = req.body;
    
    if (!alerta || !datosEvento) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere información de la alerta y datos del evento'
      });
    }

    const evento = await crearEventoDesdeAlerta(alerta, datosEvento);
    
    res.status(201).json({
      success: true,
      message: 'Evento creado desde alerta exitosamente',
      evento
    });
  } catch (error) {
    console.error('Error al crear evento desde alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear evento desde alerta',
      error: error.message
    });
  }
};

// Obtener estadísticas de eventos
export const obtenerEstadisticasEventosController = async (req, res) => {
  try {
    const estadisticas = await obtenerEstadisticasEventos();
    
    res.json({
      success: true,
      estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de eventos',
      error: error.message
    });
  }
}; 