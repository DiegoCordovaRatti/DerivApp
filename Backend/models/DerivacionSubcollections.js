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

// ===== HISTORIAL =====

// Crear entrada en historial
export const crearEntradaHistorial = async (estudianteId, derivacionId, datosHistorial) => {
  try {
    const historialData = {
      ...datosHistorial,
      fecha: new Date(datosHistorial.fecha || new Date()),
      fecha_creacion: new Date()
    };
    
    const historialRef = collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "historial");
    const docRef = await addDoc(historialRef, historialData);
    return { id: docRef.id, ...historialData };
  } catch (error) {
    throw new Error(`Error al crear entrada en historial: ${error.message}`);
  }
};

// Obtener historial de una derivación
export const obtenerHistorialDerivacion = async (estudianteId, derivacionId) => {
  try {
    const historialRef = collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "historial");
    const q = query(historialRef, orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener historial: ${error.message}`);
  }
};

// Obtener entrada específica del historial
export const obtenerEntradaHistorial = async (estudianteId, derivacionId, entradaId) => {
  try {
    const entradaRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "historial", entradaId);
    const docSnap = await getDoc(entradaRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Entrada de historial no encontrada");
    }
  } catch (error) {
    throw new Error(`Error al obtener entrada de historial: ${error.message}`);
  }
};

// Actualizar entrada del historial
export const actualizarEntradaHistorial = async (estudianteId, derivacionId, entradaId, datosActualizados) => {
  try {
    const entradaRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "historial", entradaId);
    await updateDoc(entradaRef, {
      ...datosActualizados,
      fecha_actualizacion: new Date()
    });
    return { id: entradaId, ...datosActualizados };
  } catch (error) {
    throw new Error(`Error al actualizar entrada de historial: ${error.message}`);
  }
};

// ===== ASISTENCIA =====

// Crear registro de asistencia
export const crearRegistroAsistencia = async (estudianteId, derivacionId, datosAsistencia) => {
  try {
    const asistenciaData = {
      ...datosAsistencia,
      fecha: new Date(datosAsistencia.fecha || new Date()),
      presente: datosAsistencia.presente || false,
      fecha_creacion: new Date()
    };
    
    const asistenciaRef = collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "asistencia");
    const docRef = await addDoc(asistenciaRef, asistenciaData);
    return { id: docRef.id, ...asistenciaData };
  } catch (error) {
    throw new Error(`Error al crear registro de asistencia: ${error.message}`);
  }
};

// Obtener registros de asistencia de una derivación
export const obtenerAsistenciaDerivacion = async (estudianteId, derivacionId) => {
  try {
    const asistenciaRef = collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "asistencia");
    const q = query(asistenciaRef, orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener asistencia: ${error.message}`);
  }
};

// Obtener registro específico de asistencia
export const obtenerRegistroAsistencia = async (estudianteId, derivacionId, registroId) => {
  try {
    const registroRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "asistencia", registroId);
    const docSnap = await getDoc(registroRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Registro de asistencia no encontrado");
    }
  } catch (error) {
    throw new Error(`Error al obtener registro de asistencia: ${error.message}`);
  }
};

// Actualizar registro de asistencia
export const actualizarRegistroAsistencia = async (estudianteId, derivacionId, registroId, datosActualizados) => {
  try {
    const registroRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "asistencia", registroId);
    await updateDoc(registroRef, {
      ...datosActualizados,
      fecha_actualizacion: new Date()
    });
    return { id: registroId, ...datosActualizados };
  } catch (error) {
    throw new Error(`Error al actualizar registro de asistencia: ${error.message}`);
  }
};

// ===== ALERTAS =====

// Crear alerta
export const crearAlerta = async (estudianteId, derivacionId, datosAlerta) => {
  try {
    const alertaData = {
      ...datosAlerta,
      fecha: new Date(datosAlerta.fecha || new Date()),
      estado: datosAlerta.estado || 'activa',
      fecha_creacion: new Date()
    };
    
    const alertaRef = collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas");
    const docRef = await addDoc(alertaRef, alertaData);
    return { id: docRef.id, ...alertaData };
  } catch (error) {
    throw new Error(`Error al crear alerta: ${error.message}`);
  }
};

// Obtener alertas de una derivación
export const obtenerAlertasDerivacion = async (estudianteId, derivacionId) => {
  try {
    const alertaRef = collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas");
    const q = query(alertaRef, orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener alertas: ${error.message}`);
  }
};

// Obtener alerta específica
export const obtenerAlerta = async (estudianteId, derivacionId, alertaId) => {
  try {
    const alertaRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas", alertaId);
    const docSnap = await getDoc(alertaRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Alerta no encontrada");
    }
  } catch (error) {
    throw new Error(`Error al obtener alerta: ${error.message}`);
  }
};

// Actualizar alerta
export const actualizarAlerta = async (estudianteId, derivacionId, alertaId, datosActualizados) => {
  try {
    const alertaRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas", alertaId);
    await updateDoc(alertaRef, {
      ...datosActualizados,
      fecha_actualizacion: new Date()
    });
    return { id: alertaId, ...datosActualizados };
  } catch (error) {
    throw new Error(`Error al actualizar alerta: ${error.message}`);
  }
};

// Cambiar estado de alerta
export const cambiarEstadoAlerta = async (estudianteId, derivacionId, alertaId, nuevoEstado) => {
  try {
    const alertaRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas", alertaId);
    await updateDoc(alertaRef, {
      estado: nuevoEstado,
      fecha_actualizacion: new Date()
    });
    return { message: `Alerta ${nuevoEstado} correctamente` };
  } catch (error) {
    throw new Error(`Error al cambiar estado de alerta: ${error.message}`);
  }
};

// Obtener alertas activas
export const obtenerAlertasActivas = async (estudianteId, derivacionId) => {
  try {
    const alertaRef = collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas");
    const q = query(alertaRef, where("estado", "==", "activa"), orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener alertas activas: ${error.message}`);
  }
};

// Eliminar alerta
export const eliminarAlerta = async (estudianteId, derivacionId, alertaId) => {
  try {
    const alertaRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "alertas", alertaId);
    await deleteDoc(alertaRef);
    return { message: "Alerta eliminada correctamente" };
  } catch (error) {
    throw new Error(`Error al eliminar alerta: ${error.message}`);
  }
};

export default {
  // Historial
  crearEntradaHistorial,
  obtenerHistorialDerivacion,
  obtenerEntradaHistorial,
  actualizarEntradaHistorial,
  
  // Asistencia
  crearRegistroAsistencia,
  obtenerAsistenciaDerivacion,
  obtenerRegistroAsistencia,
  actualizarRegistroAsistencia,
  
  // Alertas
  crearAlerta,
  obtenerAlertasDerivacion,
  obtenerAlerta,
  actualizarAlerta,
  cambiarEstadoAlerta,
  obtenerAlertasActivas,
  eliminarAlerta
}; 