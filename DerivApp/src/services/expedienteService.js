const API_BASE_URL = 'http://localhost:3000/api';

// Función genérica para manejar errores de API
const handleApiError = (error) => {
  console.error('Error en API:', error);
  if (error.response) {
    throw new Error(error.response.data?.message || 'Error en el servidor');
  } else if (error.request) {
    throw new Error('No se pudo conectar con el servidor');
  } else {
    throw new Error('Error inesperado');
  }
};

// Función genérica para hacer requests a la API
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// Servicios para estudiantes
export const obtenerEstudiantes = async () => {
  return await apiRequest('/estudiantes');
};

export const obtenerEstudiantePorId = async (id) => {
  return await apiRequest(`/estudiantes/${id}`);
};

export const crearEstudiante = async (datosEstudiante) => {
  return await apiRequest('/estudiantes', {
    method: 'POST',
    body: JSON.stringify(datosEstudiante),
  });
};

export const actualizarEstudiante = async (id, datosEstudiante) => {
  return await apiRequest(`/estudiantes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datosEstudiante),
  });
};

export const eliminarEstudiante = async (id) => {
  return await apiRequest(`/estudiantes/${id}`, {
    method: 'DELETE',
  });
};

// Servicios para derivaciones
export const obtenerDerivacionesEstudiante = async (estudianteId) => {
  return await apiRequest(`/estudiantes/${estudianteId}/derivaciones`);
};

export const crearDerivacion = async (estudianteId, datosDerivacion) => {
  return await apiRequest(`/estudiantes/${estudianteId}/derivaciones`, {
    method: 'POST',
    body: JSON.stringify(datosDerivacion),
  });
};

export const actualizarDerivacion = async (estudianteId, derivacionId, datosDerivacion) => {
  return await apiRequest(`/estudiantes/${estudianteId}/derivaciones/${derivacionId}`, {
    method: 'PUT',
    body: JSON.stringify(datosDerivacion),
  });
};

export const eliminarDerivacion = async (estudianteId, derivacionId) => {
  return await apiRequest(`/estudiantes/${estudianteId}/derivaciones/${derivacionId}`, {
    method: 'DELETE',
  });
};

// Servicios para seguimientos
export const crearSeguimiento = async (estudianteId, derivacionId, datosSeguimiento) => {
  return await apiRequest(`/estudiantes/${estudianteId}/derivaciones/${derivacionId}/seguimientos`, {
    method: 'POST',
    body: JSON.stringify(datosSeguimiento),
  });
};

export const actualizarSeguimiento = async (estudianteId, derivacionId, seguimientoId, datosSeguimiento) => {
  return await apiRequest(`/estudiantes/${estudianteId}/derivaciones/${derivacionId}/seguimientos/${seguimientoId}`, {
    method: 'PUT',
    body: JSON.stringify(datosSeguimiento),
  });
};

// Servicios para búsqueda y filtros
export const buscarEstudiantes = async (termino) => {
  return await apiRequest(`/estudiantes/buscar?q=${encodeURIComponent(termino)}`);
};

export const obtenerEstudiantesPorEstado = async (estado) => {
  return await apiRequest(`/estudiantes/estado/${estado}`);
};

export const obtenerDerivacionesPorEstado = async (estado) => {
  return await apiRequest(`/derivaciones/estado/${estado}`);
};

export const obtenerDerivacionesRecientes = async () => {
  return await apiRequest('/derivaciones/recientes');
}; 