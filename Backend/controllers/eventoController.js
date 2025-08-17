import {
  crearEvento,
  obtenerEventos,
  obtenerEventoPorId,
  actualizarEvento,
  eliminarEvento,
  obtenerEventosPorEstudiante,
  obtenerEventosPorDerivacion,
  obtenerEventosProximos,
  obtenerEventosPorTipo,
  obtenerEventosPorPrioridad,
  crearEventoDesdeAlerta,
  obtenerEstadisticasEventos,
  obtenerEventosTodasDerivaciones,
  obtenerEventosProximosTodasDerivaciones,
  obtenerEstadisticasEventosTodasDerivaciones,
  obtenerEventosAgendados,
  obtenerEventosNoAgendados,
  marcarEventoAgendado
} from '../models/Evento.js';
import { obtenerEstudiantePorId } from '../models/Estudiante.js';

// Función para enviar webhook a n8n
const enviarWebhookEvento = async (eventoData, estudianteId) => {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.log('N8N_WEBHOOK_URL no configurada, omitiendo webhook');
      return;
    }

    // Obtener datos completos del estudiante incluyendo información del apoderado
    let datosEstudiante = eventoData.estudiante || {};
    
    if (estudianteId) {
      try {
        const estudianteCompleto = await obtenerEstudiantePorId(estudianteId);
        datosEstudiante = {
          id: estudianteCompleto.id,
          nombre: estudianteCompleto.nombre,
          rut: estudianteCompleto.rut,
          curso: estudianteCompleto.curso,
          apoderado: estudianteCompleto.apoderado || '',
          telefono_contacto: estudianteCompleto.telefono_contacto || '',
          email_contacto: estudianteCompleto.email_contacto || '',
          estado: estudianteCompleto.estado
        };
      } catch (error) {
        console.error('Error al obtener datos completos del estudiante:', error);
        // Usar los datos básicos si no se pueden obtener los completos
      }
    }

    const payload = {
      evento: {
        id: eventoData.id,
        titulo: eventoData.titulo,
        fecha: eventoData.fecha,
        hora: eventoData.hora,
        tipo: eventoData.tipo,
        prioridad: eventoData.prioridad,
        agendado: eventoData.agendado,
        descripcion: eventoData.descripcion,
        estudiante: datosEstudiante,
        derivacion: eventoData.derivacion
      },
      timestamp: new Date().toISOString(),
      action: 'evento_creado'
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Webhook enviado exitosamente a n8n');
    console.log('📞 Datos del apoderado incluidos en webhook:');
    console.log('   - Nombre:', datosEstudiante.apoderado);
    console.log('   - Teléfono:', datosEstudiante.telefono_contacto);
    console.log('   - Email:', datosEstudiante.email_contacto);
  } catch (error) {
    console.error('Error enviando webhook a n8n:', error);
    // No fallar la creación del evento por error en webhook
  }
};

console.log('=== EVENTO CONTROLLER LOADED ===');

// Crear un nuevo evento
export const crearEventoController = async (req, res) => {
  try {
    const derivacionId = req.derivacionId || req.params.derivacionId;
    const datosEvento = req.body;
    
    // Validar que derivacionId esté presente
    if (!derivacionId) {
      return res.status(400).json({
        success: false,
        message: 'ID de derivación no encontrado en la URL'
      });
    }
    
    // Validar campos requeridos
    if (!datosEvento.titulo || !datosEvento.fecha || !datosEvento.tipo) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: título, fecha y tipo son obligatorios'
      });
    }

    // Necesitamos el estudianteId para acceder a la subcolección correcta
    if (!datosEvento.estudianteId) {
      return res.status(400).json({
        success: false,
        message: 'Falta el ID del estudiante'
      });
    }

    const evento = await crearEvento(datosEvento, datosEvento.estudianteId, derivacionId);
    
    // Enviar webhook a n8n de forma asíncrona (no bloquear la respuesta)
    enviarWebhookEvento(evento, datosEvento.estudianteId).catch(error => {
      console.error('Error en webhook (no crítico):', error);
    });
    
    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      evento
    });
    
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear evento',
      error: error.message
    });
  }
};

// Obtener todos los eventos de una derivación
export const obtenerEventosController = async (req, res) => {
  try {
    const { derivacionId } = req.params;
    const { estudianteId } = req.query; // Obtener estudianteId de query params
    
    if (!estudianteId) {
      return res.status(400).json({
        success: false,
        message: 'Falta el ID del estudiante'
      });
    }
    
    const eventos = await obtenerEventos(estudianteId, derivacionId);
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos',
      error: error.message
    });
  }
};

// Obtener evento por ID de una derivación específica
export const obtenerEventoPorIdController = async (req, res) => {
  try {
    const { id, derivacionId } = req.params;
    const evento = await obtenerEventoPorId(id, derivacionId);
    
    res.json({
      success: true,
      evento
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(404).json({
      success: false,
      message: 'Evento no encontrado',
      error: error.message
    });
  }
};

// Actualizar evento en una derivación específica
export const actualizarEventoController = async (req, res) => {
  try {
    const { id, derivacionId } = req.params;
    const datosEvento = req.body;
    
    const evento = await actualizarEvento(id, datosEvento, derivacionId);
    
    res.json({
      success: true,
      message: 'Evento actualizado exitosamente',
      evento
    });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar evento',
      error: error.message
    });
  }
};

// Eliminar evento de una derivación específica
export const eliminarEventoController = async (req, res) => {
  try {
    const { id, derivacionId } = req.params;
    await eliminarEvento(id, derivacionId);
    
    res.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar evento',
      error: error.message
    });
  }
};

// Obtener eventos por estudiante (ahora necesita derivacionId)
export const obtenerEventosPorEstudianteController = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    const eventos = await obtenerEventosPorEstudiante(estudianteId, derivacionId);
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos del estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos del estudiante',
      error: error.message
    });
  }
};

// Obtener eventos por derivación (ya tiene derivacionId)
export const obtenerEventosPorDerivacionController = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    const eventos = await obtenerEventosPorDerivacion(estudianteId, derivacionId);
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos de la derivación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos de la derivación',
      error: error.message
    });
  }
};

// Obtener eventos próximos (ahora necesita derivacionId)
export const obtenerEventosProximosController = async (req, res) => {
  try {
    const { derivacionId } = req.params;
    const eventos = await obtenerEventosProximos(derivacionId);
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos próximos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos próximos',
      error: error.message
    });
  }
};

// Obtener eventos por tipo (ahora necesita derivacionId)
export const obtenerEventosPorTipoController = async (req, res) => {
  try {
    const { tipo, derivacionId } = req.params;
    const eventos = await obtenerEventosPorTipo(tipo, derivacionId);
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos por tipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos por tipo',
      error: error.message
    });
  }
};

// Obtener eventos por prioridad (ahora necesita derivacionId)
export const obtenerEventosPorPrioridadController = async (req, res) => {
  try {
    const { prioridad, derivacionId } = req.params;
    const eventos = await obtenerEventosPorPrioridad(prioridad, derivacionId);
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos por prioridad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos por prioridad',
      error: error.message
    });
  }
};

// Crear evento desde alerta (ya tiene derivacionId en la alerta)
export const crearEventoDesdeAlertaController = async (req, res) => {
  try {
    const { alerta, datosEvento } = req.body;
    
    if (!alerta || !datosEvento) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere información de la alerta y datos del evento'
      });
    }

    const evento = await crearEventoDesdeAlerta(alerta, datosEvento);
    
    res.status(201).json({
      success: true,
      message: 'Evento creado desde alerta exitosamente',
      evento
    });
  } catch (error) {
    console.error('Error al crear evento desde alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear evento desde alerta',
      error: error.message
    });
  }
};

// Obtener estadísticas de eventos (ahora necesita derivacionId)
export const obtenerEstadisticasEventosController = async (req, res) => {
  try {
    const { derivacionId } = req.params;
    const estadisticas = await obtenerEstadisticasEventos(derivacionId);
    
    res.json({
      success: true,
      estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de eventos',
      error: error.message
    });
  }
}; 

// Obtener eventos de todas las derivaciones (para la vista de Agenda)
export const obtenerEventosTodasDerivacionesController = async (req, res) => {
  try {
    const eventos = await obtenerEventosTodasDerivaciones();
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos de todas las derivaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos de todas las derivaciones',
      error: error.message
    });
  }
};

// Obtener eventos próximos de todas las derivaciones (para la vista de Agenda)
export const obtenerEventosProximosTodasDerivacionesController = async (req, res) => {
  try {
    const eventos = await obtenerEventosProximosTodasDerivaciones();
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos próximos de todas las derivaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos próximos de todas las derivaciones',
      error: error.message
    });
  }
};

// Obtener estadísticas de eventos de todas las derivaciones (para la vista de Agenda)
export const obtenerEstadisticasEventosTodasDerivacionesController = async (req, res) => {
  try {
    const estadisticas = await obtenerEstadisticasEventosTodasDerivaciones();
    
    res.json({
      success: true,
      estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de eventos de todas las derivaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de eventos de todas las derivaciones',
      error: error.message
    });
  }
};

// Confirmar asistencia del apoderado (vía Telegram)
export const marcarEventoAgendadoController = async (req, res) => {
  try {
    const { id, derivacionId } = req.params;
    const { agendado } = req.body;

    // Validar que agendado sea un booleano
    if (typeof agendado !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'El campo agendado debe ser un valor booleano (true/false)'
      });
    }

    const datosActualizacion = {
      agendado: agendado,
      fecha_actualizacion: new Date()
    };

    const evento = await actualizarEvento(id, datosActualizacion, derivacionId);
    
    res.json({
      success: true,
      message: `Asistencia del apoderado ${agendado ? 'confirmada' : 'pendiente'} exitosamente`,
      evento
    });
  } catch (error) {
    console.error('Error al actualizar confirmación de asistencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar confirmación de asistencia',
      error: error.message
    });
  }
};

// Obtener eventos con asistencia confirmada por el apoderado
export const obtenerEventosAgendadosController = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    const eventos = await obtenerEventosAgendados(estudianteId, derivacionId);
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos con asistencia confirmada:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos con asistencia confirmada',
      error: error.message
    });
  }
};

// Obtener eventos pendientes de confirmación de asistencia
export const obtenerEventosNoAgendadosController = async (req, res) => {
  try {
    const { estudianteId, derivacionId } = req.params;
    const eventos = await obtenerEventosNoAgendados(estudianteId, derivacionId);
    
    res.json({
      success: true,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener eventos pendientes de confirmación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos pendientes de confirmación',
      error: error.message
    });
  }
}; 