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
export const actualizarEvento = async (eventoId, datosEvento, derivacionId) => {
  try {
    const eventoRef = doc(db, "derivaciones", derivacionId, "eventos", eventoId);
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
export const eliminarEvento = async (eventoId, derivacionId) => {
  try {
    await deleteDoc(doc(db, "derivaciones", derivacionId, "eventos", eventoId));
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
    // Primero obtener todos los estudiantes
    const estudiantesSnapshot = await getDocs(collection(db, "estudiantes"));
    const todosEventos = [];
    
    // Para cada estudiante, obtener sus derivaciones y eventos
    for (const estudianteDoc of estudiantesSnapshot.docs) {
      const estudianteId = estudianteDoc.id;
      const estudianteData = estudianteDoc.data();
      
      // Obtener derivaciones del estudiante
      const derivacionesSnapshot = await getDocs(collection(db, "estudiantes", estudianteId, "derivaciones"));
      
      // Para cada derivación, obtener sus eventos
      for (const derivacionDoc of derivacionesSnapshot.docs) {
        const derivacionId = derivacionDoc.id;
        const derivacionData = derivacionDoc.data();
        
        // Obtener eventos de la derivación
        const eventosSnapshot = await getDocs(collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "eventos"));
        
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

    // Ordenar por fecha
    return todosEventos.sort((a, b) => {
      const fechaA = a.fecha?.toDate?.() || new Date(a.fecha);
      const fechaB = b.fecha?.toDate?.() || new Date(b.fecha);
      return fechaA - fechaB;
    });
  } catch (error) {
    throw new Error(`Error al obtener eventos de todas las derivaciones: ${error.message}`);
  }
};

// Obtener eventos próximos de todas las derivaciones (para la vista de Agenda)
export const obtenerEventosProximosTodasDerivaciones = async () => {
  try {
    const todosEventos = await obtenerEventosTodasDerivaciones();

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
    console.error('Error al obtener eventos próximos de todas las derivaciones:', error);
    return [];
  }
};

// Obtener estadísticas de eventos de todas las derivaciones (para la vista de Agenda)
export const obtenerEstadisticasEventosTodasDerivaciones = async () => {
  try {
    const eventos = await obtenerEventosTodasDerivaciones();
    
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
    throw new Error(`Error al obtener estadísticas de eventos de todas las derivaciones: ${error.message}`);
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
  obtenerEstadisticasEventosTodasDerivaciones
}; 