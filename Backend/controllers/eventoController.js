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
      console.log('⚠️ N8N_WEBHOOK_URL no configurada, omitiendo webhook');
      return;
    }
    
    console.log('🚀 Enviando webhook de evento creado a n8n:', webhookUrl);

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
          telegram_id: estudianteCompleto.telegram_id || null,
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
        agendado: eventoData.agendado || false,
        status: eventoData.status || 'pendiente',
        descripcion: eventoData.descripcion,
        estudianteId: estudianteId,
        derivacionId: eventoData.derivacionId,
        estudiante: datosEstudiante,
        derivacion: eventoData.derivacion,
        // Información adicional para n8n
        fecha_creacion: eventoData.fecha_creacion,
        fecha_actualizacion: eventoData.fecha_actualizacion
      },
      // Metadatos para n8n
      metadata: {
        timestamp: new Date().toISOString(),
        action: 'evento_creado',
        source: 'DerivApp',
        webhook_version: '1.0'
      },
      // Datos específicos para notificación
      notificacion: {
        tipo: 'nueva_citacion',
        prioridad: eventoData.prioridad,
        requiere_confirmacion: !eventoData.agendado,
        canales: ['telegram'] // n8n puede expandir a email, whatsapp, etc.
      }
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

    console.log('✅ Webhook enviado exitosamente a n8n');
    console.log('📊 Status de respuesta:', response.status);
    console.log('🎯 Evento creado:', {
      id: eventoData.id,
      titulo: eventoData.titulo,
      estudiante: datosEstudiante.nombre,
      fecha: eventoData.fecha,
      hora: eventoData.hora
    });
    console.log('📞 Datos del apoderado incluidos en webhook:');
    console.log('   - Nombre:', datosEstudiante.apoderado);
    console.log('   - Teléfono:', datosEstudiante.telefono_contacto);
    console.log('   - Email:', datosEstudiante.email_contacto);
    console.log('   - Telegram ID:', datosEstudiante.telegram_id || 'No configurado');
  } catch (error) {
    console.error('Error enviando webhook a n8n:', error);
    // No fallar la creación del evento por error en webhook
  }
};
// Función para enviar webhook a n8n (testing)
const enviarWebhookEventoTest = async (eventoData, estudianteId) => {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_TEST_URL;
    
    if (!webhookUrl) {
      console.log('⚠️ N8N_WEBHOOK_TEST_URL no configurada, omitiendo webhook de testing');
      return;
    }
    
    console.log('🧪 Enviando webhook de testing a n8n:', webhookUrl);

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
          telegram_id: estudianteCompleto.telegram_id || null,
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
        agendado: eventoData.agendado || false,
        status: eventoData.status || 'pendiente',
        descripcion: eventoData.descripcion,
        estudianteId: estudianteId,
        derivacionId: eventoData.derivacionId,
        estudiante: datosEstudiante,
        derivacion: eventoData.derivacion,
        // Información adicional para n8n
        fecha_creacion: eventoData.fecha_creacion,
        fecha_actualizacion: eventoData.fecha_actualizacion
      },
      // Metadatos para n8n
      metadata: {
        timestamp: new Date().toISOString(),
        action: 'evento_creado_test',
        source: 'DerivApp',
        webhook_version: '1.0',
        environment: 'testing'
      },
      // Datos específicos para notificación
      notificacion: {
        tipo: 'nueva_citacion',
        prioridad: eventoData.prioridad,
        requiere_confirmacion: !eventoData.agendado,
        canales: ['telegram'] // n8n puede expandir a email, whatsapp, etc.
      }
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

    console.log('✅ Webhook de testing enviado exitosamente a n8n');
    console.log('📊 Status de respuesta:', response.status);
    console.log('🎯 Evento de testing:', {
      id: eventoData.id,
      titulo: eventoData.titulo,
      estudiante: datosEstudiante.nombre,
      fecha: eventoData.fecha,
      hora: eventoData.hora
    });
    console.log('📞 Datos del apoderado incluidos en webhook:');
    console.log('   - Nombre:', datosEstudiante.apoderado);
    console.log('   - Teléfono:', datosEstudiante.telefono_contacto);
    console.log('   - Email:', datosEstudiante.email_contacto);
    console.log('   - Telegram ID:', datosEstudiante.telegram_id || null);
  } catch (error) {
    console.error('Error enviando webhook de testing a n8n:', error);
    // No fallar la creación del evento por error en webhook
  }
};

// Función para enviar webhook cuando se modifica un evento
const enviarWebhookEventoModificado = async (eventoData, estudianteId) => {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.log('⚠️ N8N_WEBHOOK_URL no configurada, omitiendo webhook');
      return;
    }
    
    console.log('🔄 Enviando webhook de evento modificado a n8n:', webhookUrl);

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
          telegram_id: estudianteCompleto.telegram_id || null,
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
        agendado: eventoData.agendado || false,
        status: eventoData.status || 'pendiente',
        descripcion: eventoData.descripcion,
        estudianteId: estudianteId,
        derivacionId: eventoData.derivacionId,
        estudiante: datosEstudiante,
        derivacion: eventoData.derivacion,
        // Información adicional para n8n
        fecha_creacion: eventoData.fecha_creacion,
        fecha_actualizacion: eventoData.fecha_actualizacion
      },
      // Metadatos para n8n
      metadata: {
        timestamp: new Date().toISOString(),
        action: 'evento_modificado',
        source: 'DerivApp',
        webhook_version: '1.0'
      },
      // Datos específicos para notificación
      notificacion: {
        tipo: 'citacion_modificada',
        prioridad: eventoData.prioridad,
        requiere_confirmacion: !eventoData.agendado,
        canales: ['telegram'] // n8n puede expandir a email, whatsapp, etc.
      }
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

    console.log('✅ Webhook de modificación enviado exitosamente a n8n');
    console.log('📊 Status de respuesta:', response.status);
    console.log('🔄 Evento modificado:', {
      id: eventoData.id,
      titulo: eventoData.titulo,
      estudiante: datosEstudiante.nombre,
      fecha: eventoData.fecha,
      hora: eventoData.hora
    });
    console.log('📞 Datos del apoderado incluidos en webhook:');
    console.log('   - Nombre:', datosEstudiante.apoderado);
    console.log('   - Teléfono:', datosEstudiante.telefono_contacto);
    console.log('   - Email:', datosEstudiante.email_contacto);
    console.log('   - Telegram ID:', datosEstudiante.telegram_id || null);
  } catch (error) {
    console.error('Error enviando webhook de modificación a n8n:', error);
    // No fallar la modificación del evento por error en webhook
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

// Crear un nuevo evento con webhook de testing
export const crearEventoTestController = async (req, res) => {
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
    
    // Enviar webhook de testing a n8n de forma asíncrona (no bloquear la respuesta)
    enviarWebhookEventoTest(evento, datosEvento.estudianteId).catch(error => {
      console.error('Error en webhook de testing (no crítico):', error);
    });
    
    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente con webhook de testing',
      evento
    });
    
  } catch (error) {
    console.error('Error al crear evento con testing:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear evento con testing',
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
    const { id } = req.params;
    const derivacionId = req.derivacionId || req.params.derivacionId;
    const datosEvento = req.body;
    
    // Validar que derivacionId esté presente
    if (!derivacionId) {
      return res.status(400).json({
        success: false,
        message: 'ID de derivación no encontrado en la URL'
      });
    }

    // Necesitamos el estudianteId para la actualización
    if (!datosEvento.estudianteId) {
      // Buscar el evento existente para obtener el estudianteId
      const todosEventos = await obtenerEventosTodasDerivaciones();
      const eventoExistente = todosEventos.find(e => e.id === id);
      
      if (!eventoExistente) {
        return res.status(404).json({
          success: false,
          message: 'Evento no encontrado'
        });
      }
      
      datosEvento.estudianteId = eventoExistente.estudianteId;
    }
    
    const evento = await actualizarEvento(id, datosEvento, datosEvento.estudianteId, derivacionId);
    
    // Enviar webhook cuando se modifica un evento (de forma asíncrona)
    enviarWebhookEventoModificado(evento, datosEvento.estudianteId).catch(error => {
      console.error('Error en webhook de modificación (no crítico):', error);
    });
    
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
    const { id } = req.params;
    const derivacionId = req.derivacionId; // Viene del middleware

    // Validar que derivacionId esté presente
    if (!derivacionId) {
      return res.status(400).json({
        success: false,
        message: 'ID de derivación no encontrado en la ruta'
      });
    }

    // Necesitamos el estudianteId para eliminar correctamente
    const todosEventos = await obtenerEventosTodasDerivaciones();
    const eventoExistente = todosEventos.find(e => e.id === id);
    
    if (!eventoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    await eliminarEvento(id, eventoExistente.estudianteId, derivacionId);
    
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
    const { id } = req.params;
    const derivacionId = req.derivacionId; // Viene del middleware
    const { agendado } = req.body;

    console.log('🎯 Marcando evento como agendado:', { id, derivacionId, agendado });

    // Validar que derivacionId esté presente
    if (!derivacionId) {
      return res.status(400).json({
        success: false,
        message: 'ID de derivación no encontrado en la ruta'
      });
    }

    // Validar que agendado sea un booleano
    if (typeof agendado !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'El campo agendado debe ser un valor booleano (true/false)'
      });
    }

    const datosActualizacion = {
      agendado: agendado
    };

    // Para ahora, usaremos una actualización simplificada
    // Necesitamos encontrar el estudianteId desde los eventos de todas las derivaciones
    const todosEventos = await obtenerEventosTodasDerivaciones();
    const eventoEncontrado = todosEventos.find(e => e.id === id);
    
    if (!eventoEncontrado) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const evento = await actualizarEvento(id, datosActualizacion, eventoEncontrado.estudianteId, derivacionId);
    
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
    const { estudianteId } = req.params;
    const derivacionId = req.derivacionId;
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
    const { estudianteId } = req.params;
    const derivacionId = req.derivacionId;
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