import db from '../config/fireBaseDB.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// Validación de datos de informe
const validarInforme = (informe) => {
  const errores = [];
  
  if (!informe.caseId || informe.caseId.trim().length === 0) {
    errores.push("El ID del caso es obligatorio");
  }
  
  if (!informe.autorId || informe.autorId.trim().length === 0) {
    errores.push("El ID del autor es obligatorio");
  }
  
  if (!informe.fecha) {
    errores.push("La fecha del informe es obligatoria");
  }
  
  if (!informe.tipo || !['seguimiento', 'evaluación', 'cierre', 'inicial'].includes(informe.tipo)) {
    errores.push("El tipo debe ser: seguimiento, evaluación, cierre o inicial");
  }
  
  if (!informe.contenido || informe.contenido.trim().length < 10) {
    errores.push("El contenido debe tener al menos 10 caracteres");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear un nuevo informe
export const crearInforme = async (datosInforme) => {
  try {
    const validacion = validarInforme(datosInforme);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const informeData = {
      ...datosInforme,
      fecha: new Date(datosInforme.fecha),
      adjuntos: datosInforme.adjuntos || [],
      creadoEn: new Date(),
      actualizadoEn: new Date()
    };
    
    const docRef = await addDoc(collection(db, "informes"), informeData);
    return { id: docRef.id, ...informeData };
  } catch (error) {
    throw new Error(`Error al crear informe: ${error.message}`);
  }
};

// Obtener todos los informes
export const obtenerInformes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "informes"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener informes: ${error.message}`);
  }
};

// Obtener informe por ID
export const obtenerInformePorId = async (id) => {
  try {
    const docRef = doc(db, "informes", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Informe no encontrado");
    }
  } catch (error) {
    throw new Error(`Error al obtener informe: ${error.message}`);
  }
};

// Obtener informes por caso
export const obtenerInformesPorCaso = async (caseId) => {
  try {
    const q = query(collection(db, "informes"), where("caseId", "==", caseId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener informes del caso: ${error.message}`);
  }
};

// Obtener informes por autor
export const obtenerInformesPorAutor = async (autorId) => {
  try {
    const q = query(collection(db, "informes"), where("autorId", "==", autorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener informes del autor: ${error.message}`);
  }
};

// Obtener informes por tipo
export const obtenerInformesPorTipo = async (tipo) => {
  try {
    const q = query(collection(db, "informes"), where("tipo", "==", tipo));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener informes por tipo: ${error.message}`);
  }
};

// Actualizar informe
export const actualizarInforme = async (id, datosActualizados) => {
  try {
    const docRef = doc(db, "informes", id);
    
    // Validar datos si se proporcionan
    if (datosActualizados.contenido || datosActualizados.tipo) {
      const informeActual = await obtenerInformePorId(id);
      const datosCompletos = { ...informeActual, ...datosActualizados };
      const validacion = validarInforme(datosCompletos);
      
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
    throw new Error(`Error al actualizar informe: ${error.message}`);
  }
};

// Agregar adjunto a informe
export const agregarAdjuntoInforme = async (id, adjuntoUrl) => {
  try {
    const docRef = doc(db, "informes", id);
    const informe = await obtenerInformePorId(id);
    const adjuntosActualizados = [...informe.adjuntos, adjuntoUrl];
    
    await updateDoc(docRef, {
      adjuntos: adjuntosActualizados,
      actualizadoEn: new Date()
    });
    
    return { message: "Adjunto agregado correctamente", adjuntos: adjuntosActualizados };
  } catch (error) {
    throw new Error(`Error al agregar adjunto: ${error.message}`);
  }
};

// Eliminar adjunto de informe
export const eliminarAdjuntoInforme = async (id, adjuntoUrl) => {
  try {
    const docRef = doc(db, "informes", id);
    const informe = await obtenerInformePorId(id);
    const adjuntosActualizados = informe.adjuntos.filter(adj => adj !== adjuntoUrl);
    
    await updateDoc(docRef, {
      adjuntos: adjuntosActualizados,
      actualizadoEn: new Date()
    });
    
    return { message: "Adjunto eliminado correctamente", adjuntos: adjuntosActualizados };
  } catch (error) {
    throw new Error(`Error al eliminar adjunto: ${error.message}`);
  }
};

// Obtener informes de seguimiento
export const obtenerInformesSeguimiento = async () => {
  return await obtenerInformesPorTipo('seguimiento');
};

// Obtener informes de evaluación
export const obtenerInformesEvaluacion = async () => {
  return await obtenerInformesPorTipo('evaluación');
};

// Eliminar informe
export const eliminarInforme = async (id) => {
  try {
    const docRef = doc(db, "informes", id);
    await deleteDoc(docRef);
    return { message: "Informe eliminado permanentemente" };
  } catch (error) {
    throw new Error(`Error al eliminar informe: ${error.message}`);
  }
};

export default {
  crearInforme,
  obtenerInformes,
  obtenerInformePorId,
  obtenerInformesPorCaso,
  obtenerInformesPorAutor,
  obtenerInformesPorTipo,
  actualizarInforme,
  agregarAdjuntoInforme,
  eliminarAdjuntoInforme,
  obtenerInformesSeguimiento,
  obtenerInformesEvaluacion,
  eliminarInforme,
  validarInforme
}; 