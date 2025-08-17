import { apiRequest } from './apiService';

// Crear un nuevo evento
export const crearEvento = async (datosEvento, derivacionId) => {
  try {
    const response = await apiRequest('POST', `/derivaciones/${derivacionId}/eventos`, datosEvento);
    return response.evento;
  } catch (error) {
    console.error('Error al crear evento:', error);
    throw error;
  }
};

// Obtener todos los eventos de una derivación
export const obtenerEventos = async (derivacionId) => {
  try {
    const response = await apiRequest('GET', `/derivaciones/${derivacionId}/eventos`);
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return [];
  }
};

// Obtener evento por ID de una derivación específica
export const obtenerEventoPorId = async (eventoId, derivacionId) => {
  try {
    const response = await apiRequest('GET', `/derivaciones/${derivacionId}/eventos/${eventoId}`);
    return response.evento;
  } catch (error) {
    console.error('Error al obtener evento:', error);
    throw error;
  }
};

// Actualizar evento en una derivación específica
export const actualizarEvento = async (eventoId, datosEvento, derivacionId) => {
  try {
    const response = await apiRequest('PUT', `/derivaciones/${derivacionId}/eventos/${eventoId}`, datosEvento);
    return response.evento;
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    throw error;
  }
};

// Eliminar evento de una derivación específica
export const eliminarEvento = async (eventoId, derivacionId) => {
  try {
    const response = await apiRequest('DELETE', `/derivaciones/${derivacionId}/eventos/${eventoId}`);
    return response;
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    throw error;
  }
};

// Obtener eventos por estudiante (ahora necesita derivacionId)
export const obtenerEventosPorEstudiante = async (estudianteId, derivacionId) => {
  try {
    const response = await apiRequest('GET', `/derivaciones/${derivacionId}/eventos/estudiante/${estudianteId}`);
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos del estudiante:', error);
    return [];
  }
};

// Obtener eventos por derivación (ahora usa subcolección)
export const obtenerEventosPorDerivacion = async (estudianteId, derivacionId) => {
  try {
    const response = await apiRequest('GET', `/derivaciones/${derivacionId}/eventos/derivacion/${estudianteId}/${derivacionId}`);
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos de la derivación:', error);
    return [];
  }
};

// Obtener eventos próximos (ahora necesita derivacionId)
export const obtenerEventosProximos = async (derivacionId) => {
  try {
    const response = await apiRequest('GET', `/derivaciones/${derivacionId}/eventos/proximos`);
    return response; // Devolver la respuesta completa, no solo response.eventos
  } catch (error) {
    console.error('Error al obtener eventos próximos:', error);
    return { success: false, eventos: [] };
  }
};

// Obtener eventos por tipo (ahora necesita derivacionId)
export const obtenerEventosPorTipo = async (tipo, derivacionId) => {
  try {
    const response = await apiRequest('GET', `/derivaciones/${derivacionId}/eventos/tipo/${tipo}`);
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos por tipo:', error);
    return [];
  }
};

// Obtener eventos por prioridad (ahora necesita derivacionId)
export const obtenerEventosPorPrioridad = async (prioridad, derivacionId) => {
  try {
    const response = await apiRequest('GET', `/derivaciones/${derivacionId}/eventos/prioridad/${prioridad}`);
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos por prioridad:', error);
    return [];
  }
};

// Crear evento desde alerta (ya tiene derivacionId en la alerta)
export const crearEventoDesdeAlerta = async (alerta, datosEvento) => {
  try {
    const response = await apiRequest('POST', `/derivaciones/${alerta.derivacionId}/eventos/desde-alerta`, {
      alerta,
      datosEvento
    });
    return response.evento;
  } catch (error) {
    console.error('Error al crear evento desde alerta:', error);
    throw error;
  }
};

// Obtener estadísticas de eventos (ahora necesita derivacionId)
export const obtenerEstadisticasEventos = async (derivacionId) => {
  try {
    const response = await apiRequest('GET', `/derivaciones/${derivacionId}/eventos/estadisticas`);
    return response.estadisticas || {};
  } catch (error) {
    console.error('Error al obtener estadísticas de eventos:', error);
    return {};
  }
};

// Obtener eventos de todas las derivaciones (para la vista de Agenda)
export const obtenerEventosTodasDerivaciones = async () => {
  try {
    const response = await apiRequest('GET', '/eventos/todas-derivaciones');
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos de todas las derivaciones:', error);
    return [];
  }
};

// Obtener eventos próximos de todas las derivaciones (para la vista de Agenda)
export const obtenerEventosProximosTodasDerivaciones = async () => {
  try {
    const response = await apiRequest('GET', '/eventos/proximos-todas-derivaciones');
    return response; // Devolver la respuesta completa
  } catch (error) {
    console.error('Error al obtener eventos próximos de todas las derivaciones:', error);
    return { success: false, eventos: [] };
  }
};

// Obtener estadísticas de eventos de todas las derivaciones (para la vista de Agenda)
export const obtenerEstadisticasEventosTodasDerivaciones = async () => {
  try {
    const response = await apiRequest('GET', '/eventos/estadisticas-todas-derivaciones');
    return response.estadisticas || {};
  } catch (error) {
    console.error('Error al obtener estadísticas de eventos de todas las derivaciones:', error);
    return {};
  }
};

// Marcar evento como agendado/confirmado por el apoderado
export const marcarEventoAgendado = async (eventoId, agendado, derivacionId) => {
  try {
    const response = await apiRequest('PATCH', `/derivaciones/${derivacionId}/eventos/${eventoId}/agendado`, {
      agendado
    });
    return response.evento;
  } catch (error) {
    console.error('Error al marcar evento como agendado:', error);
    throw error;
  }
};

// Obtener eventos con asistencia confirmada
export const obtenerEventosAgendados = async (estudianteId, derivacionId) => {
  try {
    const response = await apiRequest('GET', `/derivaciones/${derivacionId}/eventos/agendados/${estudianteId}/${derivacionId}`);
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos agendados:', error);
    return [];
  }
};

// Obtener eventos pendientes de confirmación
export const obtenerEventosNoAgendados = async (estudianteId, derivacionId) => {
  try {
    const response = await apiRequest('GET', `/derivaciones/${derivacionId}/eventos/no-agendados/${estudianteId}/${derivacionId}`);
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos no agendados:', error);
    return [];
  }
}; 