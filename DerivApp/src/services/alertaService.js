import { apiRequest } from './apiService';

// Obtener alertas directamente de la base de datos
export const obtenerAlertas = async () => {
  try {
    // Obtener todas las alertas desde el backend
    const response = await apiRequest('GET', '/alertas');
    
    if (response.success) {
      return response.alertas || [];
    } else {
      console.error('Error al obtener alertas:', response.message);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    return [];
  }
};

// Obtener alertas por prioridad
export const obtenerAlertasPorPrioridad = async (prioridad) => {
  const alertas = await obtenerAlertas();
  return alertas.filter(alerta => alerta.prioridad === prioridad);
};

// Obtener alertas por tipo de motivo
export const obtenerAlertasPorMotivo = async (motivo) => {
  const alertas = await obtenerAlertas();
  return alertas.filter(alerta => 
    alerta.motivo.toLowerCase().includes(motivo.toLowerCase())
  );
};

// Buscar alertas por texto
export const buscarAlertas = async (texto) => {
  const alertas = await obtenerAlertas();
  return alertas.filter(alerta =>
    alerta.estudiante.nombre.toLowerCase().includes(texto.toLowerCase()) ||
    alerta.estudiante.curso.toLowerCase().includes(texto.toLowerCase()) ||
    alerta.motivo.toLowerCase().includes(texto.toLowerCase()) ||
    alerta.descripcion.toLowerCase().includes(texto.toLowerCase())
  );
}; 