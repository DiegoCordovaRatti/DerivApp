import { apiService } from './apiService';

// Servicio de notificaciones
export const notificacionService = {
  // Obtener todas las notificaciones (alertas + eventos agendados)
  obtenerNotificaciones: async () => {
    try {
      const [alertasResponse, eventosResponse] = await Promise.allSettled([
        apiService.get('/alertas'),
        apiService.get('/eventos/agendados')
      ]);

      const notificaciones = [];

      // Procesar alertas
      if (alertasResponse.status === 'fulfilled' && alertasResponse.value.success) {
        const alertas = alertasResponse.value.alertas || [];
        alertas.forEach(alerta => {
          // Determinar el tipo y color basado en nivelAlerta desde la base de datos
          const nivelAlerta = alerta.nivelAlerta || alerta.nivel_alerta || 'Alerta baja';
          let type, color;
          
          if (nivelAlerta.toLowerCase().includes('crítica') || nivelAlerta.toLowerCase().includes('critica')) {
            type = 'urgent';
            color = '#ff4d4f'; // Rojo
          } else if (nivelAlerta.toLowerCase().includes('alta')) {
            type = 'warning';
            color = '#fa8c16'; // Naranja
          } else if (nivelAlerta.toLowerCase().includes('media')) {
            type = 'info';
            color = '#faad14'; // Amarillo
          } else {
            type = 'info';
            color = '#1890ff'; // Azul
          }
          
          notificaciones.push({
            id: `alerta-${alerta.id}`,
            type: type,
            color: color,
            title: nivelAlerta, // Usar el nivel de alerta en lugar de "Alerta: Sin tipo"
            message: `${alerta.estudiante?.nombre || 'Estudiante'} ${alerta.estudiante?.apellido || ''} - ${alerta.descripcion || alerta.motivo || 'Sin descripción'}`,
            time: formatearTiempo(alerta.fecha_creacion),
            read: alerta.leida || false,
            categoria: 'alerta',
            datos: alerta
          });
        });
      }

      // Procesar eventos agendados (confirmados) - usar la misma estructura que próximos eventos
      if (eventosResponse.status === 'fulfilled') {
        let eventos = [];
        
        // Manejar diferentes formatos de respuesta como en agenda
        const eventosData = eventosResponse.value;
        if (eventosData && eventosData.success && eventosData.eventos) {
          eventos = eventosData.eventos;
        } else if (eventosData && eventosData.eventos) {
          eventos = eventosData.eventos;
        } else if (eventosData && Array.isArray(eventosData)) {
          eventos = eventosData;
        }

        eventos.forEach(evento => {
          // Solo eventos agendados que NO estén completados
          if (evento.agendado && evento.status !== 'completado') {
            const eventoDate = evento.fecha?.toDate?.() || new Date(evento.fecha);
            const estudianteNombre = evento.estudiante?.nombre || 'Estudiante';
            const estudianteCurso = evento.estudiante?.curso || '';
            
            // Determinar color y tipo basado en el status desde la base de datos
            const status = evento.status || 'pendiente';
            let type, color, title;
            
            switch (status.toLowerCase()) {
              case 'pendiente':
                type = 'warning';
                color = '#faad14'; // Amarillo
                title = 'Cita Pendiente';
                break;
              case 'confirmado':
                type = 'success';
                color = '#52c41a'; // Verde
                title = 'Cita Confirmada';
                break;
              case 'cancelado':
                type = 'error';
                color = '#ff4d4f'; // Rojo
                title = 'Cita Cancelada';
                break;
              case 'reagendado':
                type = 'info';
                color = '#1890ff'; // Azul
                title = 'Cita Reagendada';
                break;
              case 'en_progreso':
                type = 'processing';
                color = '#722ed1'; // Púrpura
                title = 'Cita en Progreso';
                break;
              default:
                type = 'info';
                color = '#1890ff';
                title = 'Cita Agendada';
            }
            
            notificaciones.push({
              id: `evento-${evento.id}`,
              type: type,
              color: color,
              title: title,
              message: `${estudianteNombre} ${estudianteCurso ? `(${estudianteCurso})` : ''} - ${evento.titulo || evento.tipo || 'Cita'}`,
              time: formatearTiempo(evento.fecha_confirmacion || evento.fecha_actualizacion || evento.fecha),
              read: false,
              categoria: 'evento',
              datos: evento
            });
          }
        });
      }

      // Ordenar por fecha más reciente
      notificaciones.sort((a, b) => {
        const timeA = new Date(a.datos?.fecha_creacion?.toDate?.() || a.datos?.fecha_creacion || a.time);
        const timeB = new Date(b.datos?.fecha_creacion?.toDate?.() || b.datos?.fecha_creacion || b.time);
        return timeB - timeA;
      });

      return {
        success: true,
        notificaciones
      };
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return {
        success: false,
        error: error.message,
        notificaciones: []
      };
    }
  },

  // Marcar notificación como leída
  marcarComoLeida: async (notificacionId) => {
    try {
      const [tipo, id] = notificacionId.split('-');
      
      if (tipo === 'alerta') {
        // Marcar alerta como leída
        const response = await apiService.patch(`/alertas/${id}/marcar-leida`);
        return response;
      }
      // Los eventos no necesitan marcarse como leídos por ahora
      
      return { success: true };
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      throw error;
    }
  },

  // Marcar todas las notificaciones como leídas
  marcarTodasComoLeidas: async () => {
    try {
      // Solo marcar alertas como leídas (los eventos no se marcan)
      const response = await apiService.patch('/alertas/marcar-todas-leidas');
      return response;
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      throw error;
    }
  },

  // Obtener conteo de notificaciones no leídas
  obtenerConteoNoLeidas: async () => {
    try {
      const response = await this.obtenerNotificaciones();
      if (response.success) {
        const noLeidas = response.notificaciones.filter(n => !n.read).length;
        return { success: true, count: noLeidas };
      }
      return { success: false, count: 0 };
    } catch (error) {
      console.error('Error al obtener conteo de notificaciones:', error);
      return { success: false, count: 0 };
    }
  }
};

// Funciones auxiliares
const formatearTiempo = (fecha) => {
  if (!fecha) return 'Fecha desconocida';
  
  try {
    // Manejar diferentes tipos de fecha como en agenda
    let fechaObj;
    if (fecha.toDate && typeof fecha.toDate === 'function') {
      fechaObj = fecha.toDate();
    } else if (fecha instanceof Date) {
      fechaObj = fecha;
    } else if (typeof fecha === 'string' || typeof fecha === 'number') {
      fechaObj = new Date(fecha);
    } else {
      return 'Fecha desconocida';
    }

    // Validar que la fecha sea válida
    if (isNaN(fechaObj.getTime())) {
      return 'Fecha desconocida';
    }

    const ahora = new Date();
    const diferencia = ahora - fechaObj;

    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 1) return 'Hace un momento';
    if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (dias < 7) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    
    return fechaObj.toLocaleDateString('es-ES');
  } catch (error) {
    console.error('Error al formatear tiempo:', error);
    return 'Fecha desconocida';
  }
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha desconocida';
  
  try {
    let fechaObj;
    if (fecha.toDate && typeof fecha.toDate === 'function') {
      fechaObj = fecha.toDate();
    } else if (fecha instanceof Date) {
      fechaObj = fecha;
    } else {
      fechaObj = new Date(fecha);
    }

    if (isNaN(fechaObj.getTime())) {
      return 'Fecha desconocida';
    }

    return fechaObj.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha desconocida';
  }
};

export default notificacionService;
