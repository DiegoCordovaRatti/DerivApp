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
export const crearEvento = async (datosEvento) => {
  try {
    const eventoData = {
      ...datosEvento,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };

    const eventoRef = await addDoc(collection(db, "eventos"), eventoData);
    return { id: eventoRef.id, ...eventoData };
  } catch (error) {
    throw new Error(`Error al crear evento: ${error.message}`);
  }
};

// Obtener todos los eventos
export const obtenerEventos = async () => {
  try {
    const eventosSnapshot = await getDocs(collection(db, "eventos"));
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

// Obtener evento por ID
export const obtenerEventoPorId = async (eventoId) => {
  try {
    const eventoDoc = await getDoc(doc(db, "eventos", eventoId));
    
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

// Actualizar evento
export const actualizarEvento = async (eventoId, datosEvento) => {
  try {
    const eventoRef = doc(db, "eventos", eventoId);
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

// Eliminar evento
export const eliminarEvento = async (eventoId) => {
  try {
    await deleteDoc(doc(db, "eventos", eventoId));
    return { success: true, message: 'Evento eliminado correctamente' };
  } catch (error) {
    throw new Error(`Error al eliminar evento: ${error.message}`);
  }
};

// Obtener eventos por estudiante
export const obtenerEventosPorEstudiante = async (estudianteId) => {
  try {
    const eventosQuery = query(
      collection(db, "eventos"),
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

// Obtener eventos por derivación
export const obtenerEventosPorDerivacion = async (estudianteId, derivacionId) => {
  try {
    const eventosQuery = query(
      collection(db, "eventos"),
      where("estudianteId", "==", estudianteId),
      where("derivacionId", "==", derivacionId),
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

// Obtener eventos próximos (próximos 7 días)
export const obtenerEventosProximos = async () => {
  try {
    // Obtener todos los eventos
    const todosEventos = await obtenerEventos();

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

// Obtener eventos por tipo
export const obtenerEventosPorTipo = async (tipo) => {
  try {
    const eventosQuery = query(
      collection(db, "eventos"),
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

// Obtener eventos por prioridad
export const obtenerEventosPorPrioridad = async (prioridad) => {
  try {
    const eventosQuery = query(
      collection(db, "eventos"),
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

// Crear evento desde alerta
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

    const eventoRef = await addDoc(collection(db, "eventos"), eventoData);
    return { id: eventoRef.id, ...eventoData };
  } catch (error) {
    throw new Error(`Error al crear evento desde alerta: ${error.message}`);
  }
};

// Obtener estadísticas de eventos
export const obtenerEstadisticasEventos = async () => {
  try {
    const eventos = await obtenerEventos();
    
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
  obtenerEstadisticasEventos
}; 