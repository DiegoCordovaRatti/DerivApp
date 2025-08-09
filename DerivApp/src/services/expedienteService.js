import { apiRequest } from './apiService';

// Servicios para estudiantes
export const obtenerEstudiantes = async () => {
  return await apiRequest('GET', '/estudiantes');
};

export const obtenerEstudiantePorId = async (id) => {
  return await apiRequest('GET', `/estudiantes/${id}`);
};

export const crearEstudiante = async (datosEstudiante) => {
  return await apiRequest('POST', '/estudiantes', datosEstudiante);
};

export const actualizarEstudiante = async (id, datosEstudiante) => {
  return await apiRequest('PUT', `/estudiantes/${id}`, datosEstudiante);
};

export const eliminarEstudiante = async (id) => {
  return await apiRequest('DELETE', `/estudiantes/${id}`);
};

// Servicios para derivaciones
export const obtenerDerivacionesEstudiante = async (estudianteId) => {
  return await apiRequest('GET', `/estudiantes/${estudianteId}/derivaciones`);
};

export const crearDerivacion = async (estudianteId, datosDerivacion) => {
  return await apiRequest('POST', `/estudiantes/${estudianteId}/derivaciones`, datosDerivacion);
};

export const actualizarDerivacion = async (estudianteId, derivacionId, datosDerivacion) => {
  return await apiRequest('PUT', `/estudiantes/${estudianteId}/derivaciones/${derivacionId}`, datosDerivacion);
};

export const eliminarDerivacion = async (estudianteId, derivacionId) => {
  return await apiRequest('DELETE', `/estudiantes/${estudianteId}/derivaciones/${derivacionId}`);
};

// Servicios para seguimientos
export const crearSeguimiento = async (estudianteId, derivacionId, datosSeguimiento) => {
  return await apiRequest('POST', `/estudiantes/${estudianteId}/derivaciones/${derivacionId}/seguimientos`, datosSeguimiento);
};

export const actualizarSeguimiento = async (estudianteId, derivacionId, seguimientoId, datosSeguimiento) => {
  return await apiRequest('PUT', `/estudiantes/${estudianteId}/derivaciones/${derivacionId}/seguimientos/${seguimientoId}`, datosSeguimiento);
};

// Servicios para búsqueda y filtros
export const buscarEstudiantes = async (termino) => {
  return await apiRequest('GET', `/estudiantes/buscar?q=${encodeURIComponent(termino)}`);
};

export const obtenerEstudiantesPorEstado = async (estado) => {
  return await apiRequest('GET', `/estudiantes/estado/${estado}`);
};

export const obtenerDerivacionesPorEstado = async (estado) => {
  return await apiRequest('GET', `/derivaciones/estado/${estado}`);
};

export const obtenerDerivacionesRecientes = async () => {
  return await apiRequest('GET', '/derivaciones/recientes');
};

// Obtener todas las derivaciones para selección de eventos
export const obtenerTodasDerivaciones = async () => {
  return await apiRequest('GET', '/derivaciones');
}; 