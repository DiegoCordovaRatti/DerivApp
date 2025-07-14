import db from '../config/fireBaseDB.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// Validación de datos de intervención
const validarIntervencion = (intervencion) => {
  const errores = [];
  
  if (!intervencion.caseId || intervencion.caseId.trim().length === 0) {
    errores.push("El ID del caso es obligatorio");
  }
  
  if (!intervencion.fecha) {
    errores.push("La fecha de la intervención es obligatoria");
  }
  
  if (!intervencion.tipo || !['entrevista individual', 'entrevista familiar', 'visita domiciliaria', 'seguimiento', 'evaluación', 'taller', 'reunión'].includes(intervencion.tipo)) {
    errores.push("El tipo debe ser: entrevista individual, entrevista familiar, visita domiciliaria, seguimiento, evaluación, taller o reunión");
  }
  
  if (!intervencion.detalle || intervencion.detalle.trim().length < 10) {
    errores.push("El detalle debe tener al menos 10 caracteres");
  }
  
  if (!intervencion.realizadaPor || intervencion.realizadaPor.trim().length === 0) {
    errores.push("El ID de quien realiza la intervención es obligatorio");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear una nueva intervención
export const crearIntervencion = async (datosIntervencion) => {
  try {
    const validacion = validarIntervencion(datosIntervencion);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const intervencionData = {
      ...datosIntervencion,
      fecha: new Date(datosIntervencion.fecha),
      creadoEn: new Date(),
      actualizadoEn: new Date()
    };
    
    const docRef = await addDoc(collection(db, "intervenciones"), intervencionData);
    return { id: docRef.id, ...intervencionData };
  } catch (error) {
    throw new Error(`Error al crear intervención: ${error.message}`);
  }
};

// Obtener todas las intervenciones
export const obtenerIntervenciones = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "intervenciones"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener intervenciones: ${error.message}`);
  }
};

// Obtener intervención por ID
export const obtenerIntervencionPorId = async (id) => {
  try {
    const docRef = doc(db, "intervenciones", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Intervención no encontrada");
    }
  } catch (error) {
    throw new Error(`Error al obtener intervención: ${error.message}`);
  }
};

// Obtener intervenciones por caso
export const obtenerIntervencionesPorCaso = async (caseId) => {
  try {
    const q = query(collection(db, "intervenciones"), where("caseId", "==", caseId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener intervenciones del caso: ${error.message}`);
  }
};

// Obtener intervenciones por tipo
export const obtenerIntervencionesPorTipo = async (tipo) => {
  try {
    const q = query(collection(db, "intervenciones"), where("tipo", "==", tipo));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener intervenciones por tipo: ${error.message}`);
  }
};

// Obtener intervenciones por profesional
export const obtenerIntervencionesPorProfesional = async (realizadaPor) => {
  try {
    const q = query(collection(db, "intervenciones"), where("realizadaPor", "==", realizadaPor));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener intervenciones del profesional: ${error.message}`);
  }
};

// Obtener intervenciones por fecha
export const obtenerIntervencionesPorFecha = async (fecha) => {
  try {
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);
    
    const q = query(
      collection(db, "intervenciones"), 
      where("fecha", ">=", fechaInicio),
      where("fecha", "<=", fechaFin)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener intervenciones por fecha: ${error.message}`);
  }
};

// Actualizar intervención
export const actualizarIntervencion = async (id, datosActualizados) => {
  try {
    const docRef = doc(db, "intervenciones", id);
    
    // Validar datos si se proporcionan
    if (datosActualizados.tipo || datosActualizados.detalle) {
      const intervencionActual = await obtenerIntervencionPorId(id);
      const datosCompletos = { ...intervencionActual, ...datosActualizados };
      const validacion = validarIntervencion(datosCompletos);
      
      if (!validacion.esValido) {
        throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
      }
    }
    
    const datosConTimestamp = {
      ...datosActualizados,
      actualizadoEn: new Date()
    };
    
    await updateDoc(docRef, datosConTimestamp);
    return { id, ...datosConTimestamp };
  } catch (error) {
    throw new Error(`Error al actualizar intervención: ${error.message}`);
  }
};

// Obtener entrevistas individuales
export const obtenerEntrevistasIndividuales = async () => {
  return await obtenerIntervencionesPorTipo('entrevista individual');
};

// Obtener entrevistas familiares
export const obtenerEntrevistasFamiliares = async () => {
  return await obtenerIntervencionesPorTipo('entrevista familiar');
};

// Obtener visitas domiciliarias
export const obtenerVisitasDomiciliarias = async () => {
  return await obtenerIntervencionesPorTipo('visita domiciliaria');
};

// Obtener seguimientos
export const obtenerSeguimientos = async () => {
  return await obtenerIntervencionesPorTipo('seguimiento');
};

// Eliminar intervención
export const eliminarIntervencion = async (id) => {
  try {
    const docRef = doc(db, "intervenciones", id);
    await deleteDoc(docRef);
    return { message: "Intervención eliminada permanentemente" };
  } catch (error) {
    throw new Error(`Error al eliminar intervención: ${error.message}`);
  }
};

export default {
  crearIntervencion,
  obtenerIntervenciones,
  obtenerIntervencionPorId,
  obtenerIntervencionesPorCaso,
  obtenerIntervencionesPorTipo,
  obtenerIntervencionesPorProfesional,
  obtenerIntervencionesPorFecha,
  actualizarIntervencion,
  obtenerEntrevistasIndividuales,
  obtenerEntrevistasFamiliares,
  obtenerVisitasDomiciliarias,
  obtenerSeguimientos,
  eliminarIntervencion,
  validarIntervencion
}; 