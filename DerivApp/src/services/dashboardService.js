import { apiRequest } from './apiService';

// Obtener estadísticas del dashboard
export const obtenerEstadisticasDashboard = async () => {
  try {
    const response = await apiRequest('GET', '/dashboard/estadisticas');
    return response;
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    throw error;
  }
};

// Obtener alertas recientes
export const obtenerAlertasRecientes = async () => {
  try {
    const response = await apiRequest('GET', '/dashboard/alertas-recientes');
    return response;
  } catch (error) {
    console.error('Error al obtener alertas recientes:', error);
    throw error;
  }
};

// Obtener eventos próximos
export const obtenerEventosProximos = async () => {
  try {
    const response = await apiRequest('GET', '/dashboard/eventos-proximos');
    return response;
  } catch (error) {
    console.error('Error al obtener eventos próximos:', error);
    throw error;
  }
};

// Obtener conteo de estudiantes derivados
export const obtenerConteoEstudiantesDerivados = async () => {
  try {
    const response = await apiRequest('GET', '/estudiantes/conteo-derivados');
    return response;
  } catch (error) {
    console.error('Error al obtener conteo de estudiantes derivados:', error);
    throw error;
  }
};

// Obtener conteo de alertas
export const obtenerConteoAlertas = async () => {
  try {
    const response = await apiRequest('GET', '/alertas/conteo');
    return response;
  } catch (error) {
    console.error('Error al obtener conteo de alertas:', error);
    throw error;
  }
}; 