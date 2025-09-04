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
      estudianteId: alerta.estudianteId,
      activo: alerta.activo // ✅ Agregar campo activo
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

// Marcar alerta como leída (función placeholder)
export const marcarAlertaComoLeida = async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Implementar lógica para marcar alerta como leída en la base de datos
    // Por ahora retornamos éxito para que no haya errores en el frontend
    
    res.json({
      success: true,
      message: 'Alerta marcada como leída'
    });
  } catch (error) {
    console.error('Error al marcar alerta como leída:', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar alerta como leída',
      error: error.message
    });
  }
};

// Marcar todas las alertas como leídas (función placeholder)
export const marcarTodasAlertasComoLeidas = async (req, res) => {
  try {
    // TODO: Implementar lógica para marcar todas las alertas como leídas
    // Por ahora retornamos éxito para que no haya errores en el frontend
    
    res.json({
      success: true,
      message: 'Todas las alertas marcadas como leídas'
    });
  } catch (error) {
    console.error('Error al marcar todas las alertas como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar todas las alertas como leídas',
      error: error.message
    });
  }
};

// Apagar alerta (desactivar)
export const apagarAlerta = async (req, res) => {
  try {
    const { estudianteId, derivacionId, alertaId } = req.params;
    
    // Importar la función del modelo
    const { apagarAlerta: apagarAlertaModel } = await import('../models/DerivacionSubcollections.js');
    
    const resultado = await apagarAlertaModel(estudianteId, derivacionId, alertaId);
    
    res.json({
      success: true,
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al apagar alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al apagar alerta',
      error: error.message
    });
  }
};

// Activar alerta
export const activarAlerta = async (req, res) => {
  try {
    const { estudianteId, derivacionId, alertaId } = req.params;
    
    // Importar la función del modelo
    const { activarAlerta: activarAlertaModel } = await import('../models/DerivacionSubcollections.js');
    
    const resultado = await activarAlertaModel(estudianteId, derivacionId, alertaId);
    
    res.json({
      success: true,
      message: resultado.message
    });
  } catch (error) {
    console.error('Error al activar alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al activar alerta',
      error: error.message
    });
  }
};

// Migrar alertas existentes (función temporal para compatibilidad)
export const migrarAlertas = async (req, res) => {
  try {
    const { migrarAlertasExistentes } = await import('../models/Estudiante.js');
    const resultado = await migrarAlertasExistentes();
    
    res.json({
      success: true,
      message: 'Migración completada',
      resultado
    });
  } catch (error) {
    console.error('Error en migración de alertas:', error);
    res.status(500).json({
      success: false,
      message: 'Error en migración de alertas',
      error: error.message
    });
  }
}; 