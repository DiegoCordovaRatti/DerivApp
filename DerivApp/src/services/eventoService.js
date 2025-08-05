import { apiRequest } from './apiService';

// Crear un nuevo evento
export const crearEvento = async (datosEvento) => {
  try {
    const response = await apiRequest('POST', '/eventos', datosEvento);
    return response.evento;
  } catch (error) {
    console.error('Error al crear evento:', error);
    throw error;
  }
};

// Obtener todos los eventos
export const obtenerEventos = async () => {
  try {
    const response = await apiRequest('GET', '/eventos');
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return [];
  }
};

// Obtener evento por ID
export const obtenerEventoPorId = async (eventoId) => {
  try {
    const response = await apiRequest('GET', `/eventos/${eventoId}`);
    return response.evento;
  } catch (error) {
    console.error('Error al obtener evento:', error);
    throw error;
  }
};

// Actualizar evento
export const actualizarEvento = async (eventoId, datosEvento) => {
  try {
    const response = await apiRequest('PUT', `/eventos/${eventoId}`, datosEvento);
    return response.evento;
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    throw error;
  }
};

// Eliminar evento
export const eliminarEvento = async (eventoId) => {
  try {
    const response = await apiRequest('DELETE', `/eventos/${eventoId}`);
    return response;
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    throw error;
  }
};

// Obtener eventos por estudiante
export const obtenerEventosPorEstudiante = async (estudianteId) => {
  try {
    const response = await apiRequest('GET', `/eventos/estudiante/${estudianteId}`);
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos del estudiante:', error);
    return [];
  }
};

// Obtener eventos por derivación
export const obtenerEventosPorDerivacion = async (estudianteId, derivacionId) => {
  try {
    const response = await apiRequest('GET', `/eventos/derivacion/${estudianteId}/${derivacionId}`);
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos de la derivación:', error);
    return [];
  }
};

// Obtener eventos próximos
export const obtenerEventosProximos = async () => {
  try {
    const response = await apiRequest('GET', '/eventos/proximos');
    return response; // Devolver la respuesta completa, no solo response.eventos
  } catch (error) {
    console.error('Error al obtener eventos próximos:', error);
    return { success: false, eventos: [] };
  }
};

// Obtener eventos por tipo
export const obtenerEventosPorTipo = async (tipo) => {
  try {
    const response = await apiRequest('GET', `/eventos/tipo/${tipo}`);
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos por tipo:', error);
    return [];
  }
};

// Obtener eventos por prioridad
export const obtenerEventosPorPrioridad = async (prioridad) => {
  try {
    const response = await apiRequest('GET', `/eventos/prioridad/${prioridad}`);
    return response.eventos || [];
  } catch (error) {
    console.error('Error al obtener eventos por prioridad:', error);
    return [];
  }
};

// Crear evento desde alerta
export const crearEventoDesdeAlerta = async (alerta, datosEvento) => {
  try {
    const response = await apiRequest('POST', '/eventos/desde-alerta', {
      alerta,
      datosEvento
    });
    return response.evento;
  } catch (error) {
    console.error('Error al crear evento desde alerta:', error);
    throw error;
  }
};

// Obtener estadísticas de eventos
export const obtenerEstadisticasEventos = async () => {
  try {
    const response = await apiRequest('GET', '/eventos/estadisticas');
    return response.estadisticas || {};
  } catch (error) {
    console.error('Error al obtener estadísticas de eventos:', error);
    return {};
  }
}; 