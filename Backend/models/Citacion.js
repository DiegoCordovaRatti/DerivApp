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
  limit
} from "firebase/firestore";

// Validación de datos de citación
const validarCitacion = (citacion) => {
  const errores = [];
  
  if (!citacion.estudianteId || citacion.estudianteId.trim().length === 0) {
    errores.push("El ID del estudiante es obligatorio");
  }
  
  if (!citacion.fecha) {
    errores.push("La fecha de la citación es obligatoria");
  }
  
  if (!citacion.tipo || !['visita_domiciliaria', 'cita_en_escuela'].includes(citacion.tipo)) {
    errores.push("El tipo debe ser: visita_domiciliaria o cita_en_escuela");
  }
  
  if (!citacion.creado_por || citacion.creado_por.trim().length === 0) {
    errores.push("El ID de quien crea la citación es obligatorio");
  }
  
  if (!citacion.estado || !['pendiente', 'realizada', 'reprogramada'].includes(citacion.estado)) {
    errores.push("El estado debe ser: pendiente, realizada o reprogramada");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear una nueva citación
export const crearCitacion = async (datosCitacion) => {
  try {
    const validacion = validarCitacion(datosCitacion);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const citacionData = {
      ...datosCitacion,
      fecha: new Date(datosCitacion.fecha),
      notificaciones: datosCitacion.notificaciones || false,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const docRef = await addDoc(collection(db, "citaciones"), citacionData);
    return { id: docRef.id, ...citacionData };
  } catch (error) {
    throw new Error(`Error al crear citación: ${error.message}`);
  }
};

// Obtener todas las citaciones
export const obtenerCitaciones = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "citaciones"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener citaciones: ${error.message}`);
  }
};

// Obtener citación por ID
export const obtenerCitacionPorId = async (id) => {
  try {
    const docRef = doc(db, "citaciones", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Citación no encontrada");
    }
  } catch (error) {
    throw new Error(`Error al obtener citación: ${error.message}`);
  }
};

// Obtener citaciones por estudiante
export const obtenerCitacionesPorEstudiante = async (estudianteId) => {
  try {
    const q = query(collection(db, "citaciones"), where("estudianteId", "==", estudianteId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener citaciones del estudiante: ${error.message}`);
  }
};

// Obtener citaciones por estado
export const obtenerCitacionesPorEstado = async (estado) => {
  try {
    const q = query(collection(db, "citaciones"), where("estado", "==", estado));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener citaciones por estado: ${error.message}`);
  }
};

// Obtener citaciones por tipo
export const obtenerCitacionesPorTipo = async (tipo) => {
  try {
    const q = query(collection(db, "citaciones"), where("tipo", "==", tipo));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener citaciones por tipo: ${error.message}`);
  }
};

// Obtener citaciones pendientes
export const obtenerCitacionesPendientes = async () => {
  return await obtenerCitacionesPorEstado('pendiente');
};

// Obtener citaciones de hoy
export const obtenerCitacionesHoy = async () => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    
    const q = query(
      collection(db, "citaciones"),
      where("fecha", ">=", hoy),
      where("fecha", "<", manana)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener citaciones de hoy: ${error.message}`);
  }
};

// Actualizar citación
export const actualizarCitacion = async (id, datosActualizados) => {
  try {
    const docRef = doc(db, "citaciones", id);
    
    // Validar datos si se proporcionan
    if (datosActualizados.tipo || datosActualizados.estado) {
      const citacionActual = await obtenerCitacionPorId(id);
      const datosCompletos = { ...citacionActual, ...datosActualizados };
      const validacion = validarCitacion(datosCompletos);
      
      if (!validacion.esValido) {
        throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
      }
    }
    
    const datosConTimestamp = {
      ...datosActualizados,
      fecha_actualizacion: new Date()
    };
    
    await updateDoc(docRef, datosConTimestamp);
    return { id, ...datosConTimestamp };
  } catch (error) {
    throw new Error(`Error al actualizar citación: ${error.message}`);
  }
};

// Cambiar estado de citación
export const cambiarEstadoCitacion = async (id, nuevoEstado) => {
  try {
    const docRef = doc(db, "citaciones", id);
    await updateDoc(docRef, {
      estado: nuevoEstado,
      fecha_actualizacion: new Date()
    });
    return { message: `Citación ${nuevoEstado} correctamente` };
  } catch (error) {
    throw new Error(`Error al cambiar estado de citación: ${error.message}`);
  }
};

// Marcar citación como realizada
export const marcarCitacionRealizada = async (id) => {
  return await cambiarEstadoCitacion(id, 'realizada');
};

// Reprogramar citación
export const reprogramarCitacion = async (id, nuevaFecha) => {
  try {
    const docRef = doc(db, "citaciones", id);
    await updateDoc(docRef, {
      fecha: new Date(nuevaFecha),
      estado: 'pendiente',
      fecha_actualizacion: new Date()
    });
    return { message: "Citación reprogramada correctamente" };
  } catch (error) {
    throw new Error(`Error al reprogramar citación: ${error.message}`);
  }
};

// Eliminar citación
export const eliminarCitacion = async (id) => {
  try {
    const docRef = doc(db, "citaciones", id);
    await deleteDoc(docRef);
    return { message: "Citación eliminada permanentemente" };
  } catch (error) {
    throw new Error(`Error al eliminar citación: ${error.message}`);
  }
};

export default {
  crearCitacion,
  obtenerCitaciones,
  obtenerCitacionPorId,
  obtenerCitacionesPorEstudiante,
  obtenerCitacionesPorEstado,
  obtenerCitacionesPorTipo,
  obtenerCitacionesPendientes,
  obtenerCitacionesHoy,
  actualizarCitacion,
  cambiarEstadoCitacion,
  marcarCitacionRealizada,
  reprogramarCitacion,
  eliminarCitacion,
  validarCitacion
}; 