// Servicio para manejar las operaciones de estudiantes con el backend
const API_BASE_URL = 'http://localhost:3000/api';

// Función para manejar errores de la API
const handleApiError = (error) => {
  console.error('Error en la API:', error);
  if (error.response) {
    throw new Error(error.response.data.error || 'Error en el servidor');
  } else if (error.request) {
    throw new Error('No se pudo conectar con el servidor');
  } else {
    throw new Error('Error inesperado');
  }
};

// Función para hacer peticiones HTTP
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// ===== SERVICIOS DE ESTUDIANTES =====

// Obtener todos los estudiantes
export const obtenerEstudiantes = async () => {
  try {
    const response = await apiRequest('/estudiantes');
    // Asegurar que devuelva un array
    return response.estudiantes || response || [];
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    return [];
  }
};

// Obtener estudiante por ID
export const obtenerEstudiantePorId = async (id) => {
  return await apiRequest(`/estudiantes/${id}`);
};

// Obtener estudiante por RUT
export const obtenerEstudiantePorRut = async (rut) => {
  return await apiRequest(`/estudiantes/rut/${rut}`);
};

// Crear un nuevo estudiante
export const crearEstudiante = async (datosEstudiante) => {
  return await apiRequest('/estudiantes', {
    method: 'POST',
    body: JSON.stringify(datosEstudiante),
  });
};

// Actualizar estudiante
export const actualizarEstudiante = async (id, datosActualizados) => {
  return await apiRequest(`/estudiantes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datosActualizados),
  });
};

// Cambiar estado de estudiante
export const cambiarEstadoEstudiante = async (id, nuevoEstado) => {
  return await apiRequest(`/estudiantes/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado: nuevoEstado }),
  });
};

// Eliminar estudiante
export const eliminarEstudiante = async (id) => {
  return await apiRequest(`/estudiantes/${id}`, {
    method: 'DELETE',
  });
};

// Obtener estudiantes por estado
export const obtenerEstudiantesPorEstado = async (estado) => {
  return await apiRequest(`/estudiantes/estado/${estado}`);
};

// Obtener estudiantes por establecimiento
export const obtenerEstudiantesPorEstablecimiento = async (establecimientoId) => {
  return await apiRequest(`/estudiantes/establecimiento/${establecimientoId}`);
};

// Buscar estudiantes
export const buscarEstudiantes = async (termino) => {
  return await apiRequest(`/estudiantes/buscar?q=${encodeURIComponent(termino)}`);
};

// ===== SERVICIOS DE DERIVACIONES =====

// Crear una nueva derivación
export const crearDerivacion = async (estudianteId, datosDerivacion) => {
  console.log('Enviando derivación:', { estudianteId, datosDerivacion });
  const response = await apiRequest(`/estudiantes/${estudianteId}/derivaciones`, {
    method: 'POST',
    body: JSON.stringify(datosDerivacion),
  });
  console.log('Respuesta del servidor:', response);
  return response;
};

// Obtener derivaciones de un estudiante
export const obtenerDerivacionesEstudiante = async (estudianteId) => {
  return await apiRequest(`/estudiantes/${estudianteId}/derivaciones`);
};

// Obtener derivación por ID
export const obtenerDerivacionPorId = async (estudianteId, derivacionId) => {
  return await apiRequest(`/estudiantes/${estudianteId}/derivaciones/${derivacionId}`);
};

// Actualizar derivación
export const actualizarDerivacion = async (estudianteId, derivacionId, datosActualizados) => {
  return await apiRequest(`/estudiantes/${estudianteId}/derivaciones/${derivacionId}`, {
    method: 'PUT',
    body: JSON.stringify(datosActualizados),
  });
};

// Cambiar estado de derivación
export const cambiarEstadoDerivacion = async (estudianteId, derivacionId, nuevoEstado) => {
  return await apiRequest(`/estudiantes/${estudianteId}/derivaciones/${derivacionId}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado: nuevoEstado }),
  });
};

// Obtener derivaciones por estado
export const obtenerDerivacionesPorEstado = async (estado) => {
  return await apiRequest(`/derivaciones/estado/${estado}`);
};

// Obtener derivaciones recientes
export const obtenerDerivacionesRecientes = async (limite = 10) => {
  return await apiRequest(`/derivaciones/recientes?limite=${limite}`);
};

export default {
  // Estudiantes
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  obtenerEstudiantePorRut,
  crearEstudiante,
  actualizarEstudiante,
  cambiarEstadoEstudiante,
  eliminarEstudiante,
  obtenerEstudiantesPorEstado,
  obtenerEstudiantesPorEstablecimiento,
  buscarEstudiantes,
  // Derivaciones
  crearDerivacion,
  obtenerDerivacionesEstudiante,
  obtenerDerivacionPorId,
  actualizarDerivacion,
  cambiarEstadoDerivacion,
  obtenerDerivacionesPorEstado,
  obtenerDerivacionesRecientes,
}; 