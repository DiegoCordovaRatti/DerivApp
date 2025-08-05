import { db } from '../config/fireBaseDB.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, orderBy, limit, collectionGroup } from "firebase/firestore";

// Validación de datos de intervención (ahora entrada de historial)
const validarIntervencion = (intervencion) => {
  const errores = [];
  
  if (!intervencion.estudianteId || intervencion.estudianteId.trim().length === 0) {
    errores.push("El ID del estudiante es obligatorio");
  }
  
  if (!intervencion.derivacionId || intervencion.derivacionId.trim().length === 0) {
    errores.push("El ID de la derivación es obligatorio");
  }
  
  if (!intervencion.fecha) {
    errores.push("La fecha de la intervención es obligatoria");
  }
  
  if (!intervencion.tipo || !['contacto', 'visita', 'actualización', 'informe'].includes(intervencion.tipo)) {
    errores.push("El tipo debe ser: contacto, visita, actualización o informe");
  }
  
  if (!intervencion.descripcion || intervencion.descripcion.trim().length < 10) {
    errores.push("La descripción debe tener al menos 10 caracteres");
  }
  
  if (!intervencion.creado_por || intervencion.creado_por.trim().length === 0) {
    errores.push("El ID de quien crea la intervención es obligatorio");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear una nueva intervención (entrada en historial)
export const crearIntervencion = async (estudianteId, derivacionId, datosIntervencion) => {
  try {
    const validacion = validarIntervencion({
      ...datosIntervencion,
      estudianteId,
      derivacionId
    });
    
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const intervencionData = {
      ...datosIntervencion,
      estudianteId,
      derivacionId,
      fecha: new Date(datosIntervencion.fecha || new Date()),
      fecha_creacion: new Date()
    };
    
    const historialRef = collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "historial");
    const docRef = await addDoc(historialRef, intervencionData);
    return { id: docRef.id, ...intervencionData };
  } catch (error) {
    throw new Error(`Error al crear intervención: ${error.message}`);
  }
};

// Obtener todas las intervenciones de una derivación
export const obtenerIntervencionesDerivacion = async (estudianteId, derivacionId) => {
  try {
    const historialRef = collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "historial");
    const q = query(historialRef, orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener intervenciones de la derivación: ${error.message}`);
  }
};

// Obtener intervención por ID
export const obtenerIntervencionPorId = async (estudianteId, derivacionId, intervencionId) => {
  try {
    const docRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "historial", intervencionId);
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

// Obtener todas las intervenciones (usando collectionGroup)
export const obtenerTodasIntervenciones = async () => {
  try {
    const historialRef = collectionGroup(db, "historial");
    const q = query(historialRef, orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener todas las intervenciones: ${error.message}`);
  }
};

// Obtener intervenciones por tipo
export const obtenerIntervencionesPorTipo = async (tipo) => {
  try {
    const historialRef = collectionGroup(db, "historial");
    const q = query(historialRef, where("tipo", "==", tipo), orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener intervenciones por tipo: ${error.message}`);
  }
};

// Obtener intervenciones por profesional
export const obtenerIntervencionesPorProfesional = async (creadoPor) => {
  try {
    const historialRef = collectionGroup(db, "historial");
    const q = query(historialRef, where("creado_por", "==", creadoPor), orderBy("fecha", "desc"));
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
    
    const historialRef = collectionGroup(db, "historial");
    const q = query(
      historialRef, 
      where("fecha", ">=", fechaInicio),
      where("fecha", "<=", fechaFin),
      orderBy("fecha", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener intervenciones por fecha: ${error.message}`);
  }
};

// Actualizar intervención
export const actualizarIntervencion = async (estudianteId, derivacionId, intervencionId, datosActualizados) => {
  try {
    const docRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "historial", intervencionId);
    
    // Validar datos si se proporcionan
    if (datosActualizados.tipo || datosActualizados.descripcion) {
      const intervencionActual = await obtenerIntervencionPorId(estudianteId, derivacionId, intervencionId);
      const datosCompletos = { ...intervencionActual, ...datosActualizados };
      const validacion = validarIntervencion(datosCompletos);
      
      if (!validacion.esValido) {
        throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
      }
    }
    
    const datosConTimestamp = {
      ...datosActualizados,
      fecha_actualizacion: new Date()
    };
    
    await updateDoc(docRef, datosConTimestamp);
    return { id: intervencionId, ...datosConTimestamp };
  } catch (error) {
    throw new Error(`Error al actualizar intervención: ${error.message}`);
  }
};

// Obtener contactos
export const obtenerContactos = async () => {
  return await obtenerIntervencionesPorTipo('contacto');
};

// Obtener visitas
export const obtenerVisitas = async () => {
  return await obtenerIntervencionesPorTipo('visita');
};

// Obtener actualizaciones
export const obtenerActualizaciones = async () => {
  return await obtenerIntervencionesPorTipo('actualización');
};

// Obtener informes
export const obtenerInformes = async () => {
  return await obtenerIntervencionesPorTipo('informe');
};

// Obtener intervenciones recientes
export const obtenerIntervencionesRecientes = async (limite = 10) => {
  try {
    const historialRef = collectionGroup(db, "historial");
    const q = query(historialRef, orderBy("fecha", "desc"), limit(limite));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener intervenciones recientes: ${error.message}`);
  }
};

// Eliminar intervención
export const eliminarIntervencion = async (estudianteId, derivacionId, intervencionId) => {
  try {
    const docRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "historial", intervencionId);
    await deleteDoc(docRef);
    return { message: "Intervención eliminada permanentemente" };
  } catch (error) {
    throw new Error(`Error al eliminar intervención: ${error.message}`);
  }
};

// Obtener estadísticas de intervenciones por tipo
export const obtenerEstadisticasIntervenciones = async () => {
  try {
    const historialRef = collectionGroup(db, "historial");
    const querySnapshot = await getDocs(historialRef);
    const intervenciones = querySnapshot.docs.map(doc => doc.data());
    
    const estadisticas = {
      total: intervenciones.length,
      porTipo: {
        contacto: 0,
        visita: 0,
        actualización: 0,
        informe: 0
      },
      porMes: {}
    };
    
    intervenciones.forEach(intervencion => {
      // Contar por tipo
      if (estadisticas.porTipo[intervencion.tipo] !== undefined) {
        estadisticas.porTipo[intervencion.tipo]++;
      }
      
      // Contar por mes
      const fecha = intervencion.fecha.toDate ? intervencion.fecha.toDate() : new Date(intervencion.fecha);
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      estadisticas.porMes[mes] = (estadisticas.porMes[mes] || 0) + 1;
    });
    
    return estadisticas;
  } catch (error) {
    throw new Error(`Error al obtener estadísticas de intervenciones: ${error.message}`);
  }
};

export default {
  crearIntervencion,
  obtenerIntervencionesDerivacion,
  obtenerIntervencionPorId,
  obtenerTodasIntervenciones,
  obtenerIntervencionesPorTipo,
  obtenerIntervencionesPorProfesional,
  obtenerIntervencionesPorFecha,
  actualizarIntervencion,
  obtenerContactos,
  obtenerVisitas,
  obtenerActualizaciones,
  obtenerInformes,
  obtenerIntervencionesRecientes,
  eliminarIntervencion,
  obtenerEstadisticasIntervenciones,
  validarIntervencion
}; 