const API_BASE_URL = 'http://localhost:3000/api';

// Importar utilidades de alerta
import { calcularNivelAlertaDerivacion } from '../utils/alertaUtils.js';

// Función para manejar errores de la API
const handleApiError = (error) => {
  console.error('Error en la API:', error);
  if (error.response) {
    throw new Error(error.response.data?.error || 'Error en el servidor');
  } else if (error.request) {
    throw new Error('No se pudo conectar con el servidor');
  } else {
    throw new Error('Error inesperado');
  }
};

// Función genérica para hacer peticiones a la API
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// Obtener todos los estudiantes
export const obtenerEstudiantes = async () => {
  return apiRequest('/estudiantes');
};

// Obtener estudiantes con derivaciones activas
export const obtenerEstudiantesConDerivaciones = async () => {
  return apiRequest('/estudiantes');
};

// Obtener derivaciones de un estudiante
export const obtenerDerivacionesEstudiante = async (estudianteId) => {
  return apiRequest(`/estudiantes/${estudianteId}/derivaciones`);
};

// Función para convertir fechas de Firestore
const convertirFechaFirestore = (fecha) => {
  if (!fecha) return '';
  
  try {
    // Si es un objeto Timestamp de Firestore
    if (fecha && typeof fecha === 'object' && fecha.seconds) {
      const date = new Date(fecha.seconds * 1000);
      return date.toLocaleDateString('es-CL');
    }
    
    // Si es un objeto Timestamp de Firestore con toDate
    if (fecha && typeof fecha === 'object' && fecha.toDate) {
      const date = fecha.toDate();
      return date.toLocaleDateString('es-CL');
    }
    
    // Si es una fecha normal
    if (fecha instanceof Date) {
      return fecha.toLocaleDateString('es-CL');
    }
    
    // Si es un string
    if (typeof fecha === 'string') {
      const date = new Date(fecha);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('es-CL');
      }
    }
    
    return '';
  } catch (error) {
    console.error('Error al convertir fecha:', fecha, error);
    return '';
  }
};

// Obtener alertas generadas automáticamente
export const obtenerAlertas = async () => {
  try {
    // Obtener todos los estudiantes
    const estudiantesResponse = await obtenerEstudiantes();
    const estudiantes = estudiantesResponse.estudiantes || estudiantesResponse;

    // Para cada estudiante, obtener sus derivaciones
    const estudiantesConDerivaciones = await Promise.all(
      estudiantes.map(async (estudiante) => {
        try {
          const derivacionesResponse = await obtenerDerivacionesEstudiante(estudiante.id);
          const derivaciones = derivacionesResponse.derivaciones || derivacionesResponse;
          
          // Para cada derivación, obtener sus seguimientos de la subcolección
          const derivacionesConSeguimientos = await Promise.all(
            (derivaciones || []).map(async (derivacion) => {
              try {
                // Obtener seguimientos de la subcolección
                const seguimientosData = await apiRequest(`/estudiantes/${estudiante.id}/derivaciones/${derivacion.id}/seguimientos`);
                const seguimientos = seguimientosData.seguimientos || seguimientosData || [];
                return {
                  ...derivacion,
                  seguimientos: seguimientos
                };
              } catch (error) {
                console.error(`Error al obtener seguimientos para derivación ${derivacion.id}:`, error);
                return {
                  ...derivacion,
                  seguimientos: []
                };
              }
            })
          );
          
          return {
            ...estudiante,
            derivaciones: derivacionesConSeguimientos
          };
        } catch (error) {
          console.error(`Error al obtener derivaciones para estudiante ${estudiante.id}:`, error);
          return {
            ...estudiante,
            derivaciones: []
          };
        }
      })
    );

    // Generar alertas basadas en las derivaciones
    const alertas = [];
    
    estudiantesConDerivaciones.forEach(estudiante => {
      if (estudiante.derivaciones && estudiante.derivaciones.length > 0) {
        // Obtener la derivación más reciente
        const derivacionMasReciente = estudiante.derivaciones
          .sort((a, b) => {
            const fechaA = a.fecha_derivacion?.seconds ? new Date(a.fecha_derivacion.seconds * 1000) : new Date(a.fecha_derivacion);
            const fechaB = b.fecha_derivacion?.seconds ? new Date(b.fecha_derivacion.seconds * 1000) : new Date(b.fecha_derivacion);
            return fechaB - fechaA;
          })[0];

        if (derivacionMasReciente) {
          // Calcular nivel de alerta para la derivación
          const nivelAlerta = calcularNivelAlertaDerivacion(derivacionMasReciente);
          // Crear alerta basada en la derivación
          const alerta = {
            id: `alerta_${estudiante.id}_${derivacionMasReciente.id}`,
            estudiante: {
              nombre: estudiante.nombre,
              curso: estudiante.curso,
              avatar: estudiante.nombre.charAt(0) + (estudiante.nombre.split(' ')[1]?.charAt(0) || '')
            },
            prioridad: derivacionMasReciente.prioridad || 'media',
            fecha: convertirFechaFirestore(derivacionMasReciente.fecha_derivacion),
            motivo: derivacionMasReciente.motivo || 'Derivación psicosocial',
            descripcion: derivacionMasReciente.descripcion || 'Estudiante derivado para atención psicosocial',
            derivacion: derivacionMasReciente,
            estudianteCompleto: estudiante,
            nivelAlerta: nivelAlerta.nivelAlerta,
            scoreReal: nivelAlerta.scoreReal,
            scoreNormalizado: nivelAlerta.scoreNormalizado,
            colorAlerta: nivelAlerta.color,
            iconoAlerta: nivelAlerta.icono
          };
          alertas.push(alerta);
        }
      }
    });

    return alertas;
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    throw error;
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