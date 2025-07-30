import db from '../config/fireBaseDB.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where,
  orderBy,
  limit
} from "firebase/firestore";

// Validación de datos de actividad
const validarActividad = (actividad) => {
  const errores = [];
  
  if (!actividad.usuarioId || actividad.usuarioId.trim().length === 0) {
    errores.push("El ID del usuario es obligatorio");
  }
  
  if (!actividad.tipo_accion || !['crear', 'actualizar', 'eliminar', 'ver'].includes(actividad.tipo_accion)) {
    errores.push("El tipo de acción debe ser: crear, actualizar, eliminar o ver");
  }
  
  if (!actividad.objeto_afectado || !['estudiante', 'derivacion', 'alerta', 'formulario', 'citacion', 'usuario', 'establecimiento'].includes(actividad.objeto_afectado)) {
    errores.push("El objeto afectado debe ser: estudiante, derivacion, alerta, formulario, citacion, usuario o establecimiento");
  }
  
  if (!actividad.detalles || actividad.detalles.trim().length === 0) {
    errores.push("Los detalles son obligatorios");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear una nueva actividad (log)
export const crearActividad = async (datosActividad) => {
  try {
    const validacion = validarActividad(datosActividad);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const actividadData = {
      ...datosActividad,
      fecha: new Date(datosActividad.fecha || new Date()),
      fecha_creacion: new Date()
    };
    
    const docRef = await addDoc(collection(db, "actividades"), actividadData);
    return { id: docRef.id, ...actividadData };
  } catch (error) {
    throw new Error(`Error al crear actividad: ${error.message}`);
  }
};

// Obtener todas las actividades
export const obtenerActividades = async () => {
  try {
    const q = query(collection(db, "actividades"), orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener actividades: ${error.message}`);
  }
};

// Obtener actividad por ID
export const obtenerActividadPorId = async (id) => {
  try {
    const docRef = doc(db, "actividades", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Actividad no encontrada");
    }
  } catch (error) {
    throw new Error(`Error al obtener actividad: ${error.message}`);
  }
};

// Obtener actividades por usuario
export const obtenerActividadesPorUsuario = async (usuarioId) => {
  try {
    const q = query(
      collection(db, "actividades"), 
      where("usuarioId", "==", usuarioId),
      orderBy("fecha", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener actividades del usuario: ${error.message}`);
  }
};

// Obtener actividades por tipo de acción
export const obtenerActividadesPorTipoAccion = async (tipoAccion) => {
  try {
    const q = query(
      collection(db, "actividades"), 
      where("tipo_accion", "==", tipoAccion),
      orderBy("fecha", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener actividades por tipo de acción: ${error.message}`);
  }
};

// Obtener actividades por objeto afectado
export const obtenerActividadesPorObjeto = async (objetoAfectado) => {
  try {
    const q = query(
      collection(db, "actividades"), 
      where("objeto_afectado", "==", objetoAfectado),
      orderBy("fecha", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener actividades por objeto: ${error.message}`);
  }
};

// Obtener actividades recientes
export const obtenerActividadesRecientes = async (limite = 50) => {
  try {
    const q = query(
      collection(db, "actividades"),
      orderBy("fecha", "desc"),
      limit(limite)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener actividades recientes: ${error.message}`);
  }
};

// Obtener actividades por fecha
export const obtenerActividadesPorFecha = async (fecha) => {
  try {
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);
    
    const q = query(
      collection(db, "actividades"),
      where("fecha", ">=", fechaInicio),
      where("fecha", "<=", fechaFin),
      orderBy("fecha", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener actividades por fecha: ${error.message}`);
  }
};

// Obtener estadísticas de actividades
export const obtenerEstadisticasActividades = async () => {
  try {
    const actividades = await obtenerActividades();
    
    const estadisticas = {
      total: actividades.length,
      porTipoAccion: {
        crear: actividades.filter(a => a.tipo_accion === 'crear').length,
        actualizar: actividades.filter(a => a.tipo_accion === 'actualizar').length,
        eliminar: actividades.filter(a => a.tipo_accion === 'eliminar').length,
        ver: actividades.filter(a => a.tipo_accion === 'ver').length
      },
      porObjeto: {
        estudiante: actividades.filter(a => a.objeto_afectado === 'estudiante').length,
        derivacion: actividades.filter(a => a.objeto_afectado === 'derivacion').length,
        alerta: actividades.filter(a => a.objeto_afectado === 'alerta').length,
        formulario: actividades.filter(a => a.objeto_afectado === 'formulario').length,
        citacion: actividades.filter(a => a.objeto_afectado === 'citacion').length,
        usuario: actividades.filter(a => a.objeto_afectado === 'usuario').length,
        establecimiento: actividades.filter(a => a.objeto_afectado === 'establecimiento').length
      },
      recientes: actividades
        .filter(a => {
          const fecha = new Date(a.fecha);
          const hace7Dias = new Date();
          hace7Dias.setDate(hace7Dias.getDate() - 7);
          return fecha >= hace7Dias;
        })
        .length
    };
    
    return estadisticas;
  } catch (error) {
    throw new Error(`Error al obtener estadísticas de actividades: ${error.message}`);
  }
};

// Funciones helper para crear actividades específicas

// Log de creación
export const logCreacion = async (usuarioId, objetoAfectado, detalles, objetoId = null) => {
  return await crearActividad({
    usuarioId,
    tipo_accion: 'crear',
    objeto_afectado: objetoAfectado,
    detalles: `${detalles}${objetoId ? ` (ID: ${objetoId})` : ''}`,
    objeto_id: objetoId
  });
};

// Log de actualización
export const logActualizacion = async (usuarioId, objetoAfectado, detalles, objetoId = null) => {
  return await crearActividad({
    usuarioId,
    tipo_accion: 'actualizar',
    objeto_afectado: objetoAfectado,
    detalles: `${detalles}${objetoId ? ` (ID: ${objetoId})` : ''}`,
    objeto_id: objetoId
  });
};

// Log de eliminación
export const logEliminacion = async (usuarioId, objetoAfectado, detalles, objetoId = null) => {
  return await crearActividad({
    usuarioId,
    tipo_accion: 'eliminar',
    objeto_afectado: objetoAfectado,
    detalles: `${detalles}${objetoId ? ` (ID: ${objetoId})` : ''}`,
    objeto_id: objetoId
  });
};

// Log de visualización
export const logVisualizacion = async (usuarioId, objetoAfectado, detalles, objetoId = null) => {
  return await crearActividad({
    usuarioId,
    tipo_accion: 'ver',
    objeto_afectado: objetoAfectado,
    detalles: `${detalles}${objetoId ? ` (ID: ${objetoId})` : ''}`,
    objeto_id: objetoId
  });
};

export default {
  crearActividad,
  obtenerActividades,
  obtenerActividadPorId,
  obtenerActividadesPorUsuario,
  obtenerActividadesPorTipoAccion,
  obtenerActividadesPorObjeto,
  obtenerActividadesRecientes,
  obtenerActividadesPorFecha,
  obtenerEstadisticasActividades,
  logCreacion,
  logActualizacion,
  logEliminacion,
  logVisualizacion,
  validarActividad
}; 