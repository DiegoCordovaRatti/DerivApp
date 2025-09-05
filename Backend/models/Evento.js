import { db } from '../config/fireBaseDB.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';

// Crear un nuevo evento
export const crearEvento = async (datosEvento, estudianteId, derivacionId) => {
  try {
    const eventoData = {
      ...datosEvento,
      estudianteId: estudianteId,
      derivacionId: derivacionId,
      agendado: datosEvento.agendado || false, // Campo booleano para confirmar asistencia del apoderado vía Telegram
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };

    // Crear evento como subcolección de la derivación dentro del estudiante
    const eventoRef = await addDoc(collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "eventos"), eventoData);
    
    return { id: eventoRef.id, ...eventoData };
  } catch (error) {
    throw new Error(`Error al crear evento: ${error.message}`);
  }
};

// Obtener todos los eventos de una derivación
export const obtenerEventos = async (estudianteId, derivacionId) => {
  try {
    const eventosSnapshot = await getDocs(collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "eventos"));
    const eventos = [];
    
    eventosSnapshot.forEach((doc) => {
      eventos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return eventos.sort((a, b) => {
      const fechaA = a.fecha?.toDate?.() || new Date(a.fecha);
      const fechaB = b.fecha?.toDate?.() || new Date(b.fecha);
      return fechaA - fechaB;
    });
  } catch (error) {
    throw new Error(`Error al obtener eventos: ${error.message}`);
  }
};

// Obtener evento por ID de una derivación específica
export const obtenerEventoPorId = async (eventoId, derivacionId) => {
  try {
    const eventoDoc = await getDoc(doc(db, "derivaciones", derivacionId, "eventos", eventoId));
    
    if (eventoDoc.exists()) {
      return {
        id: eventoDoc.id,
        ...eventoDoc.data()
      };
    } else {
      throw new Error('Evento no encontrado');
    }
  } catch (error) {
    throw new Error(`Error al obtener evento: ${error.message}`);
  }
};

// Actualizar evento en una derivación específica
export const actualizarEvento = async (eventoId, datosEvento, estudianteId, derivacionId) => {
  try {
    // Usar la estructura correcta de Firestore
    const eventoRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "eventos", eventoId);
    const datosActualizados = {
      ...datosEvento,
      fecha_actualizacion: new Date()
    };

    await updateDoc(eventoRef, datosActualizados);
    return { id: eventoId, ...datosActualizados };
  } catch (error) {
    throw new Error(`Error al actualizar evento: ${error.message}`);
  }
};

// Eliminar evento de una derivación específica
export const eliminarEvento = async (eventoId, estudianteId, derivacionId) => {
  try {
    const eventoRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "eventos", eventoId);
    await deleteDoc(eventoRef);
    return { success: true, message: 'Evento eliminado correctamente' };
  } catch (error) {
    throw new Error(`Error al eliminar evento: ${error.message}`);
  }
};

// Obtener eventos por estudiante (ahora necesita derivacionId)
export const obtenerEventosPorEstudiante = async (estudianteId, derivacionId) => {
  try {
    const eventosQuery = query(
      collection(db, "derivaciones", derivacionId, "eventos"),
      where("estudianteId", "==", estudianteId),
      orderBy("fecha", "asc")
    );
    
    const eventosSnapshot = await getDocs(eventosQuery);
    const eventos = [];
    
    eventosSnapshot.forEach((doc) => {
      eventos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return eventos;
  } catch (error) {
    throw new Error(`Error al obtener eventos del estudiante: ${error.message}`);
  }
};

// Obtener eventos por derivación (ahora usa subcolección)
export const obtenerEventosPorDerivacion = async (estudianteId, derivacionId) => {
  try {
    const eventosQuery = query(
      collection(db, "derivaciones", derivacionId, "eventos"),
      where("estudianteId", "==", estudianteId),
      orderBy("fecha", "asc")
    );
    
    const eventosSnapshot = await getDocs(eventosQuery);
    const eventos = [];
    
    eventosSnapshot.forEach((doc) => {
      eventos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return eventos;
  } catch (error) {
    throw new Error(`Error al obtener eventos de la derivación: ${error.message}`);
  }
};

// Obtener eventos próximos (próximos 7 días) - ahora necesita derivacionId
export const obtenerEventosProximos = async (derivacionId) => {
  try {
    // Obtener todos los eventos de la derivación
    const todosEventos = await obtenerEventos(derivacionId);

    // Filtrar eventos próximos
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const proximaSemana = new Date();
    proximaSemana.setDate(hoy.getDate() + 7);
    proximaSemana.setHours(23, 59, 59, 999);

    const eventosProximos = todosEventos.filter(evento => {
      const eventoFecha = evento.fecha?.toDate?.() || new Date(evento.fecha);
      return eventoFecha >= hoy && eventoFecha <= proximaSemana;
    });

    return eventosProximos.slice(0, 10); // Limitar a 10 eventos
  } catch (error) {
    console.error('Error al obtener eventos próximos:', error);
    return [];
  }
};

// Obtener eventos por tipo (ahora necesita derivacionId)
export const obtenerEventosPorTipo = async (tipo, derivacionId) => {
  try {
    const eventosQuery = query(
      collection(db, "derivaciones", derivacionId, "eventos"),
      where("tipo", "==", tipo),
      orderBy("fecha", "asc")
    );
    
    const eventosSnapshot = await getDocs(eventosQuery);
    const eventos = [];
    
    eventosSnapshot.forEach((doc) => {
      eventos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return eventos;
  } catch (error) {
    throw new Error(`Error al obtener eventos por tipo: ${error.message}`);
  }
};

// Obtener eventos por prioridad (ahora necesita derivacionId)
export const obtenerEventosPorPrioridad = async (prioridad, derivacionId) => {
  try {
    const eventosQuery = query(
      collection(db, "derivaciones", derivacionId, "eventos"),
      where("prioridad", "==", prioridad),
      orderBy("fecha", "asc")
    );
    
    const eventosSnapshot = await getDocs(eventosQuery);
    const eventos = [];
    
    eventosSnapshot.forEach((doc) => {
      eventos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return eventos;
  } catch (error) {
    throw new Error(`Error al obtener eventos por prioridad: ${error.message}`);
  }
};

// Crear evento desde alerta (ahora necesita derivacionId)
export const crearEventoDesdeAlerta = async (alerta, datosEvento) => {
  try {
    const eventoData = {
      ...datosEvento,
      estudianteId: alerta.estudianteId,
      derivacionId: alerta.derivacionId,
      alertaId: alerta.id,
      estudiante: alerta.estudiante,
      derivacion: {
        motivo: alerta.motivo,
        descripcion: alerta.descripcion
      },
      nivelAlerta: alerta.nivelAlerta,
      scoreNormalizado: alerta.scoreNormalizado,
      agendado: datosEvento.agendado || false, // Campo booleano para confirmar asistencia del apoderado vía Telegram
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };

    // Crear evento como subcolección de la derivación
    const eventoRef = await addDoc(collection(db, "derivaciones", alerta.derivacionId, "eventos"), eventoData);
    return { id: eventoRef.id, ...eventoData };
  } catch (error) {
    throw new Error(`Error al crear evento desde alerta: ${error.message}`);
  }
};

// Obtener estadísticas de eventos (ahora necesita derivacionId)
export const obtenerEstadisticasEventos = async (derivacionId) => {
  try {
    const eventos = await obtenerEventos(derivacionId);
    
    const estadisticas = {
      total: eventos.length,
      confirmados: eventos.filter(e => e.status === 'confirmado').length,
      pendientes: eventos.filter(e => e.status === 'pendiente').length,
      altaPrioridad: eventos.filter(e => e.prioridad === 'alta').length,
      seguimientos: eventos.filter(e => e.tipo === 'seguimiento').length,
      evaluaciones: eventos.filter(e => e.tipo === 'evaluacion').length,
      intervenciones: eventos.filter(e => e.tipo === 'intervencion').length,
      reuniones: eventos.filter(e => e.tipo === 'reunion').length
    };

    return estadisticas;
  } catch (error) {
    throw new Error(`Error al obtener estadísticas de eventos: ${error.message}`);
  }
};

// Obtener eventos de todas las derivaciones (para la vista de Agenda)
export const obtenerEventosTodasDerivaciones = async () => {
  try {
    console.log('🔍 Obteniendo eventos de todas las derivaciones...');
    // Primero obtener todos los estudiantes
    const estudiantesSnapshot = await getDocs(collection(db, "estudiantes"));
    console.log('👥 Estudiantes encontrados:', estudiantesSnapshot.docs.length);
    const todosEventos = [];
    
    // Para cada estudiante, obtener sus derivaciones y eventos
    for (const estudianteDoc of estudiantesSnapshot.docs) {
      const estudianteId = estudianteDoc.id;
      const estudianteData = estudianteDoc.data();
      console.log('👤 Procesando estudiante:', estudianteData.nombre);
      
      // Obtener derivaciones del estudiante
      const derivacionesSnapshot = await getDocs(collection(db, "estudiantes", estudianteId, "derivaciones"));
      console.log(`📋 Derivaciones para ${estudianteData.nombre}:`, derivacionesSnapshot.docs.length);
      
      // Para cada derivación, obtener sus eventos
      for (const derivacionDoc of derivacionesSnapshot.docs) {
        const derivacionId = derivacionDoc.id;
        const derivacionData = derivacionDoc.data();
        
        // Obtener eventos de la derivación
        const eventosSnapshot = await getDocs(collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "eventos"));
        console.log(`📅 Eventos para derivación ${derivacionId}:`, eventosSnapshot.docs.length);
        
        eventosSnapshot.forEach((eventoDoc) => {
          todosEventos.push({
            id: eventoDoc.id,
            estudianteId: estudianteId,
            derivacionId: derivacionId,
            estudiante: {
              nombre: estudianteData.nombre,
              curso: estudianteData.curso,
              rut: estudianteData.rut
            },
            derivacion: {
              motivo: derivacionData.motivo,
              descripcion: derivacionData.descripcion,
              estado: derivacionData.estado_derivacion
            },
            ...eventoDoc.data()
          });
        });
      }
    }

    console.log('🎯 Total eventos encontrados:', todosEventos.length);
    
    // Ordenar por fecha
    const eventosOrdenados = todosEventos.sort((a, b) => {
      const fechaA = a.fecha?.toDate?.() || new Date(a.fecha);
      const fechaB = b.fecha?.toDate?.() || new Date(b.fecha);
      return fechaA - fechaB;
    });
    
    console.log('✅ Eventos ordenados y listos para enviar');
    return eventosOrdenados;
  } catch (error) {
    throw new Error(`Error al obtener eventos de todas las derivaciones: ${error.message}`);
  }
};

// Obtener eventos próximos de todas las derivaciones (para la vista de Agenda)
export const obtenerEventosProximosTodasDerivaciones = async () => {
  try {
    console.log('🔍 Obteniendo eventos próximos...');
    const todosEventos = await obtenerEventosTodasDerivaciones();
    console.log('📊 Total eventos encontrados:', todosEventos.length);

    if (todosEventos.length === 0) {
      console.log('⚠️ No hay eventos para filtrar');
      return [];
    }

    // Usar un rango más amplio para asegurar que capturamos eventos
    const hoy = new Date();
    const proximoMes = new Date();
    proximoMes.setDate(hoy.getDate() + 30); // 30 días en lugar de 7

    console.log('📅 Rango de fechas ampliado:', { 
      desde: hoy.toISOString(), 
      hasta: proximoMes.toISOString() 
    });

    const eventosProximos = [];
    
    for (const evento of todosEventos) {
      try {
        let eventoFecha;
        
        // Debug: mostrar información del evento
        console.log('🔍 Procesando evento:', {
          id: evento.id,
          titulo: evento.titulo,
          fechaOriginal: evento.fecha,
          tipoFecha: typeof evento.fecha
        });
        
        // Manejar diferentes formatos de fecha
        if (evento.fecha?.toDate) {
          // Timestamp de Firestore
          eventoFecha = evento.fecha.toDate();
        } else if (typeof evento.fecha === 'string') {
          // String ISO
          eventoFecha = new Date(evento.fecha);
        } else if (evento.fecha instanceof Date) {
          // Ya es un objeto Date
          eventoFecha = evento.fecha;
        } else {
          console.warn('⚠️ Formato de fecha no reconocido para evento:', evento.id, evento.fecha);
          continue;
        }
        
        // Verificar que la fecha sea válida
        if (isNaN(eventoFecha.getTime())) {
          console.warn('⚠️ Fecha inválida para evento:', evento.id, evento.fecha);
          continue;
        }
        
        // Para debugging, mostrar todas las fechas
        console.log('📅 Fecha procesada:', {
          evento: evento.titulo,
          fecha: eventoFecha.toISOString(),
          esProximo: eventoFecha >= hoy
        });
        
        // Solo verificar que la fecha sea futura (no limitar por rango máximo aún)
        if (eventoFecha >= hoy) {
          eventosProximos.push(evento);
          console.log('✅ Evento próximo agregado:', {
            id: evento.id,
            titulo: evento.titulo,
            fecha: eventoFecha.toISOString()
          });
        }
        
      } catch (error) {
        console.error('❌ Error procesando fecha del evento:', evento.id, error);
      }
    }

    // Ordenar por fecha más próxima primero
    eventosProximos.sort((a, b) => {
      const fechaA = a.fecha?.toDate?.() || new Date(a.fecha);
      const fechaB = b.fecha?.toDate?.() || new Date(b.fecha);
      return fechaA - fechaB;
    });

    console.log('🎯 Eventos próximos encontrados:', eventosProximos.length);
    
    // Devolver los primeros 10
    const resultado = eventosProximos.slice(0, 10);
    console.log('📤 Devolviendo eventos próximos:', resultado.length);
    
    return resultado;
  } catch (error) {
    console.error('Error al obtener eventos próximos de todas las derivaciones:', error);
    return [];
  }
};

// Obtener estadísticas de eventos de todas las derivaciones (para la vista de Agenda)
export const obtenerEstadisticasEventosTodasDerivaciones = async () => {
  try {
    console.log('📈 Calculando estadísticas de eventos...');
    const eventos = await obtenerEventosTodasDerivaciones();
    console.log('📊 Eventos para estadísticas:', eventos.length);
    
    // Debug: mostrar algunos eventos de muestra
    if (eventos.length > 0) {
      console.log('🔍 Muestra de eventos:', eventos.slice(0, 3).map(e => ({
        id: e.id,
        tipo: e.tipo,
        prioridad: e.prioridad,
        status: e.status,
        agendado: e.agendado
      })));
    }
    
    const estadisticas = {
      total: eventos.length,
      confirmados: eventos.filter(e => e.agendado === true).length, // Cambiado de status a agendado
      pendientes: eventos.filter(e => e.agendado === false || e.agendado === undefined).length,
      altaPrioridad: eventos.filter(e => e.prioridad === 'alta').length,
      seguimientos: eventos.filter(e => e.tipo === 'seguimiento').length,
      evaluaciones: eventos.filter(e => e.tipo === 'evaluacion').length,
      intervenciones: eventos.filter(e => e.tipo === 'intervencion').length,
      reuniones: eventos.filter(e => e.tipo === 'reunion').length
    };

    console.log('📊 Estadísticas calculadas:', estadisticas);
    return estadisticas;
  } catch (error) {
    throw new Error(`Error al obtener estadísticas de eventos de todas las derivaciones: ${error.message}`);
  }
};

// Obtener eventos agendados de una derivación
export const obtenerEventosAgendados = async (estudianteId, derivacionId) => {
  try {
    const eventosQuery = query(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "eventos"),
      where("agendado", "==", true),
      orderBy("fecha", "asc")
    );
    
    const eventosSnapshot = await getDocs(eventosQuery);
    const eventos = [];
    
    eventosSnapshot.forEach((doc) => {
      eventos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return eventos;
  } catch (error) {
    throw new Error(`Error al obtener eventos agendados: ${error.message}`);
  }
};

// Obtener todos los eventos agendados del sistema (para notificaciones)
export const obtenerTodosLosEventosAgendados = async () => {
  try {
    const estudiantesSnapshot = await getDocs(collection(db, "estudiantes"));
    const todosLosEventos = [];
    
    for (const estudianteDoc of estudiantesSnapshot.docs) {
      const estudianteId = estudianteDoc.id;
      const estudianteData = estudianteDoc.data();
      
      const derivacionesSnapshot = await getDocs(collection(db, "estudiantes", estudianteId, "derivaciones"));
      
      for (const derivacionDoc of derivacionesSnapshot.docs) {
        const derivacionId = derivacionDoc.id;
        const derivacionData = derivacionDoc.data();
        
        // Simplificar la consulta - solo filtrar por agendado sin ordenar
        const eventosQuery = query(
          collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "eventos"),
          where("agendado", "==", true)
        );
        
        const eventosSnapshot = await getDocs(eventosQuery);
        
        eventosSnapshot.forEach((eventoDoc) => {
          const eventoData = eventoDoc.data();
          todosLosEventos.push({
            id: eventoDoc.id,
            ...eventoData,
            estudianteId,
            derivacionId,
            estudiante: {
              id: estudianteId,
              nombre: estudianteData.nombre,
              apellido: estudianteData.apellido,
              rut: estudianteData.rut,
              curso: estudianteData.curso
            },
            derivacion: {
              id: derivacionId,
              motivo: derivacionData.motivo,
              tipo: derivacionData.tipo
            }
          });
        });
      }
    }
    
    // Ordenar en memoria después de obtener todos los datos
    todosLosEventos.sort((a, b) => {
      const fechaA = a.fecha_confirmacion || a.fecha_actualizacion || a.fecha;
      const fechaB = b.fecha_confirmacion || b.fecha_actualizacion || b.fecha;
      
      try {
        const timeA = fechaA?.toDate ? fechaA.toDate() : new Date(fechaA);
        const timeB = fechaB?.toDate ? fechaB.toDate() : new Date(fechaB);
        return timeB - timeA; // Más recientes primero
      } catch (error) {
        return 0; // Si hay error en fechas, mantener orden actual
      }
    });
    
    return todosLosEventos.slice(0, 20); // Solo los 20 más recientes
  } catch (error) {
    console.error('Error detallado en obtenerTodosLosEventosAgendados:', error);
    throw new Error(`Error al obtener todos los eventos agendados: ${error.message}`);
  }
};

// Obtener eventos no agendados de una derivación
export const obtenerEventosNoAgendados = async (estudianteId, derivacionId) => {
  try {
    // Como Firestore no permite queries OR, hacemos dos consultas
    const eventosQueryFalse = query(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "eventos"),
      where("agendado", "==", false),
      orderBy("fecha", "asc")
    );
    
    // Para campos undefined, obtenemos todos y filtramos localmente
    const todosEventos = await obtenerEventos(estudianteId, derivacionId);
    const eventosNoAgendados = todosEventos.filter(evento => 
      evento.agendado === false || evento.agendado === undefined
    );

    return eventosNoAgendados;
  } catch (error) {
    throw new Error(`Error al obtener eventos no agendados: ${error.message}`);
  }
};

// Marcar evento como agendado/no agendado
export const marcarEventoAgendado = async (eventoId, agendado, estudianteId, derivacionId) => {
  try {
    const eventoRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "eventos", eventoId);
    const datosActualizados = {
      agendado: agendado,
      fecha_actualizacion: new Date()
    };

    await updateDoc(eventoRef, datosActualizados);
    return { id: eventoId, ...datosActualizados };
  } catch (error) {
    throw new Error(`Error al marcar evento como agendado: ${error.message}`);
  }
};

export default {
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
  obtenerTodosLosEventosAgendados,
  obtenerEventosNoAgendados,
  marcarEventoAgendado
}; 