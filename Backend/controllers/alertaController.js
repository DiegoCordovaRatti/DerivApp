import { obtenerAlertasRecientes } from '../models/Estudiante.js';

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

// Obtener todas las alertas
export const obtenerTodasLasAlertas = async (req, res) => {
  try {
    const alertas = await obtenerAlertasRecientes();
    
    // Formatear las alertas para el frontend
    const alertasFormateadas = alertas.map(alerta => ({
      id: alerta.id,
      estudiante: {
        nombre: alerta.estudiante?.nombre || 'Estudiante no encontrado',
        curso: alerta.estudiante?.curso || 'Curso no especificado',
        rut: alerta.estudiante?.rut || ''
      },
      nivelAlerta: alerta.nivelAlerta,
      scoreNormalizado: alerta.scoreNormalizado,
      scoreReal: alerta.scoreReal,
      fecha: convertirFechaFirestore(alerta.fecha_creacion),
      motivo: alerta.derivacion?.motivo || 'Derivación psicosocial',
      descripcion: alerta.derivacion?.descripcion || 'Estudiante derivado para atención psicosocial',
      derivacionId: alerta.derivacionId,
      estudianteId: alerta.estudianteId
    }));

    res.json({
      success: true,
      alertas: alertasFormateadas
    });
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener alertas',
      error: error.message
    });
  }
}; 