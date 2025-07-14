import db from '../config/fireBaseDB.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// Validación de datos de caso
const validarCaso = (caso) => {
  const errores = [];
  
  if (!caso.studentId || caso.studentId.trim().length === 0) {
    errores.push("El ID del estudiante es obligatorio");
  }
  
  if (!caso.responsableId || caso.responsableId.trim().length === 0) {
    errores.push("El ID del responsable es obligatorio");
  }
  
  if (!caso.fechaApertura) {
    errores.push("La fecha de apertura es obligatoria");
  }
  
  if (!caso.estado || !['en seguimiento', 'cerrado', 'archivado', 'pendiente'].includes(caso.estado)) {
    errores.push("El estado debe ser: en seguimiento, cerrado, archivado o pendiente");
  }
  
  if (!caso.motivo || caso.motivo.trim().length < 5) {
    errores.push("El motivo debe tener al menos 5 caracteres");
  }
  
  if (!caso.derivadoPor || caso.derivadoPor.trim().length === 0) {
    errores.push("El ID de quien deriva es obligatorio");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear un nuevo caso
export const crearCaso = async (datosCaso) => {
  try {
    const validacion = validarCaso(datosCaso);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const casoData = {
      ...datosCaso,
      fechaApertura: new Date(datosCaso.fechaApertura),
      últimaActualización: new Date(),
      creadoEn: new Date()
    };
    
    const docRef = await addDoc(collection(db, "casos"), casoData);
    return { id: docRef.id, ...casoData };
  } catch (error) {
    throw new Error(`Error al crear caso: ${error.message}`);
  }
};

// Obtener todos los casos
export const obtenerCasos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "casos"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener casos: ${error.message}`);
  }
};

// Obtener caso por ID
export const obtenerCasoPorId = async (id) => {
  try {
    const docRef = doc(db, "casos", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Caso no encontrado");
    }
  } catch (error) {
    throw new Error(`Error al obtener caso: ${error.message}`);
  }
};

// Obtener casos por estudiante
export const obtenerCasosPorEstudiante = async (studentId) => {
  try {
    const q = query(collection(db, "casos"), where("studentId", "==", studentId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener casos del estudiante: ${error.message}`);
  }
};

// Obtener casos por responsable
export const obtenerCasosPorResponsable = async (responsableId) => {
  try {
    const q = query(collection(db, "casos"), where("responsableId", "==", responsableId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener casos del responsable: ${error.message}`);
  }
};

// Obtener casos por estado
export const obtenerCasosPorEstado = async (estado) => {
  try {
    const q = query(collection(db, "casos"), where("estado", "==", estado));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener casos por estado: ${error.message}`);
  }
};

// Actualizar caso
export const actualizarCaso = async (id, datosActualizados) => {
  try {
    const docRef = doc(db, "casos", id);
    
    // Validar datos si se proporcionan
    if (datosActualizados.motivo || datosActualizados.estado) {
      const casoActual = await obtenerCasoPorId(id);
      const datosCompletos = { ...casoActual, ...datosActualizados };
      const validacion = validarCaso(datosCompletos);
      
      if (!validacion.esValido) {
        throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
      }
    }
    
    const datosConTimestamp = {
      ...datosActualizados,
      últimaActualización: new Date()
    };
    
    await updateDoc(docRef, datosConTimestamp);
    return { id, ...datosConTimestamp };
  } catch (error) {
    throw new Error(`Error al actualizar caso: ${error.message}`);
  }
};

// Cambiar estado de caso
export const cambiarEstadoCaso = async (id, nuevoEstado) => {
  try {
    const docRef = doc(db, "casos", id);
    await updateDoc(docRef, {
      estado: nuevoEstado,
      últimaActualización: new Date()
    });
    return { message: `Caso ${nuevoEstado} correctamente` };
  } catch (error) {
    throw new Error(`Error al cambiar estado del caso: ${error.message}`);
  }
};

// Cerrar caso
export const cerrarCaso = async (id) => {
  return await cambiarEstadoCaso(id, 'cerrado');
};

// Obtener casos activos (en seguimiento)
export const obtenerCasosActivos = async () => {
  return await obtenerCasosPorEstado('en seguimiento');
};

// Obtener casos pendientes
export const obtenerCasosPendientes = async () => {
  return await obtenerCasosPorEstado('pendiente');
};

// Eliminar caso
export const eliminarCaso = async (id) => {
  try {
    const docRef = doc(db, "casos", id);
    await deleteDoc(docRef);
    return { message: "Caso eliminado permanentemente" };
  } catch (error) {
    throw new Error(`Error al eliminar caso: ${error.message}`);
  }
};

export default {
  crearCaso,
  obtenerCasos,
  obtenerCasoPorId,
  obtenerCasosPorEstudiante,
  obtenerCasosPorResponsable,
  obtenerCasosPorEstado,
  actualizarCaso,
  cambiarEstadoCaso,
  cerrarCaso,
  obtenerCasosActivos,
  obtenerCasosPendientes,
  eliminarCaso,
  validarCaso
}; 