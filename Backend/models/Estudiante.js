import db from '../config/fireBaseDB.js';
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
  collectionGroup,
  orderBy,
  limit
} from "firebase/firestore";

// Validación de datos de estudiante
const validarEstudiante = (estudiante) => {
  const errores = [];
  
  if (!estudiante.nombre || estudiante.nombre.trim().length < 2) {
    errores.push("El nombre debe tener al menos 2 caracteres");
  }
  
  if (!estudiante.rut || !/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(estudiante.rut)) {
    errores.push("El RUT debe tener formato válido (ej: 12.345.678-9)");
  }
  
  if (!estudiante.curso || estudiante.curso.trim().length < 2) {
    errores.push("El curso es obligatorio");
  }
  
  if (!estudiante.establecimientoId || estudiante.establecimientoId.trim().length === 0) {
    errores.push("El ID del establecimiento es obligatorio");
  }
  
  if (!estudiante.estado || !['activo', 'egresado', 'derivado'].includes(estudiante.estado)) {
    errores.push("El estado debe ser: activo, egresado o derivado");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear un nuevo estudiante
export const crearEstudiante = async (datosEstudiante) => {
  try {
    const validacion = validarEstudiante(datosEstudiante);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const estudianteData = {
      ...datosEstudiante,
      estado: datosEstudiante.estado || 'activo',
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const docRef = await addDoc(collection(db, "estudiantes"), estudianteData);
    return { id: docRef.id, ...estudianteData };
  } catch (error) {
    throw new Error(`Error al crear estudiante: ${error.message}`);
  }
};

// Obtener todos los estudiantes
export const obtenerEstudiantes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "estudiantes"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener estudiantes: ${error.message}`);
  }
};

// Obtener estudiante por ID
export const obtenerEstudiantePorId = async (id) => {
  try {
    const docRef = doc(db, "estudiantes", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Estudiante no encontrado");
    }
  } catch (error) {
    throw new Error(`Error al obtener estudiante: ${error.message}`);
  }
};

// Obtener estudiante por RUT
export const obtenerEstudiantePorRut = async (rut) => {
  try {
    const q = query(collection(db, "estudiantes"), where("rut", "==", rut));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Error al buscar estudiante por RUT: ${error.message}`);
  }
};

// Obtener estudiantes por establecimiento
export const obtenerEstudiantesPorEstablecimiento = async (establecimientoId) => {
  try {
    const q = query(collection(db, "estudiantes"), where("establecimientoId", "==", establecimientoId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener estudiantes por establecimiento: ${error.message}`);
  }
};

// Obtener estudiantes por estado
export const obtenerEstudiantesPorEstado = async (estado) => {
  try {
    const q = query(collection(db, "estudiantes"), where("estado", "==", estado));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener estudiantes por estado: ${error.message}`);
  }
};

// Obtener estudiantes activos
export const obtenerEstudiantesActivos = async () => {
  try {
    const q = query(collection(db, "estudiantes"), where("estado", "==", "activo"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener estudiantes activos: ${error.message}`);
  }
};

// Actualizar estudiante
export const actualizarEstudiante = async (id, datosActualizados) => {
  try {
    const docRef = doc(db, "estudiantes", id);
    
    // Validar datos si se proporcionan
    if (datosActualizados.nombre || datosActualizados.rut || datosActualizados.curso) {
      const estudianteActual = await obtenerEstudiantePorId(id);
      const datosCompletos = { ...estudianteActual, ...datosActualizados };
      const validacion = validarEstudiante(datosCompletos);
      
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
    throw new Error(`Error al actualizar estudiante: ${error.message}`);
  }
};

// Cambiar estado de estudiante
export const cambiarEstadoEstudiante = async (id, nuevoEstado) => {
  try {
    const docRef = doc(db, "estudiantes", id);
    await updateDoc(docRef, {
      estado: nuevoEstado,
      fecha_actualizacion: new Date()
    });
    return { message: `Estudiante ${nuevoEstado} correctamente` };
  } catch (error) {
    throw new Error(`Error al cambiar estado: ${error.message}`);
  }
};

// Eliminar estudiante
export const eliminarEstudiante = async (id) => {
  try {
    const docRef = doc(db, "estudiantes", id);
    await deleteDoc(docRef);
    return { message: "Estudiante eliminado permanentemente" };
  } catch (error) {
    throw new Error(`Error al eliminar estudiante: ${error.message}`);
  }
};

// ===== MÉTODOS PARA SUBCOLECCIÓN DERIVACIONES =====

// Crear una nueva derivación para un estudiante
export const crearDerivacion = async (estudianteId, datosDerivacion) => {
  try {
    const derivacionData = {
      ...datosDerivacion,
      fecha_derivacion: new Date(datosDerivacion.fecha_derivacion || new Date()),
      estado: datosDerivacion.estado || 'en_proceso',
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const derivacionRef = collection(db, "estudiantes", estudianteId, "derivaciones");
    const docRef = await addDoc(derivacionRef, derivacionData);
    return { id: docRef.id, ...derivacionData };
  } catch (error) {
    throw new Error(`Error al crear derivación: ${error.message}`);
  }
};

// Obtener todas las derivaciones de un estudiante
export const obtenerDerivacionesEstudiante = async (estudianteId) => {
  try {
    const derivacionesRef = collection(db, "estudiantes", estudianteId, "derivaciones");
    const querySnapshot = await getDocs(derivacionesRef);
    
    // Obtener derivaciones y sus seguimientos
    const derivacionesConSeguimientos = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const derivacion = { id: doc.id, ...doc.data() };
        
        try {
          // Obtener seguimientos de esta derivación
          const seguimientosRef = collection(db, "estudiantes", estudianteId, "derivaciones", doc.id, "seguimientos");
          const seguimientosSnapshot = await getDocs(seguimientosRef);
          const seguimientos = seguimientosSnapshot.docs.map(seguimientoDoc => ({
            id: seguimientoDoc.id,
            ...seguimientoDoc.data()
          }));
          
          return {
            ...derivacion,
            seguimientos: seguimientos
          };
        } catch (error) {
          console.error(`Error al cargar seguimientos para derivación ${doc.id}:`, error);
          return {
            ...derivacion,
            seguimientos: []
          };
        }
      })
    );
    
    return derivacionesConSeguimientos;
  } catch (error) {
    throw new Error(`Error al obtener derivaciones del estudiante: ${error.message}`);
  }
};

// Obtener una derivación específica
export const obtenerDerivacionPorId = async (estudianteId, derivacionId) => {
  try {
    const derivacionRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId);
    const docSnap = await getDoc(derivacionRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Derivación no encontrada");
    }
  } catch (error) {
    throw new Error(`Error al obtener derivación: ${error.message}`);
  }
};

// Actualizar derivación
export const actualizarDerivacion = async (estudianteId, derivacionId, datosActualizados) => {
  try {
    const derivacionRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId);
    
    const datosConTimestamp = {
      ...datosActualizados,
      fecha_actualizacion: new Date()
    };
    
    await updateDoc(derivacionRef, datosConTimestamp);
    return { id: derivacionId, ...datosConTimestamp };
  } catch (error) {
    throw new Error(`Error al actualizar derivación: ${error.message}`);
  }
};

// Cambiar estado de derivación
export const cambiarEstadoDerivacion = async (estudianteId, derivacionId, nuevoEstado) => {
  try {
    const derivacionRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId);
    await updateDoc(derivacionRef, {
      estado: nuevoEstado,
      fecha_actualizacion: new Date()
    });
    return { message: `Derivación ${nuevoEstado} correctamente` };
  } catch (error) {
    throw new Error(`Error al cambiar estado de derivación: ${error.message}`);
  }
};

// Obtener derivaciones por estado
export const obtenerDerivacionesPorEstado = async (estado) => {
  try {
    // Usar collectionGroup para buscar en todas las subcolecciones de derivaciones
    const derivacionesRef = collectionGroup(db, "derivaciones");
    const q = query(derivacionesRef, where("estado", "==", estado));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener derivaciones por estado: ${error.message}`);
  }
};

// Obtener derivaciones recientes
export const obtenerDerivacionesRecientes = async (limite = 10) => {
  try {
    const derivacionesRef = collectionGroup(db, "derivaciones");
    const q = query(
      derivacionesRef, 
      orderBy("fecha_derivacion", "desc"), 
      limit(limite)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener derivaciones recientes: ${error.message}`);
  }
};

// Eliminar derivación
export const eliminarDerivacion = async (estudianteId, derivacionId) => {
  try {
    const derivacionRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId);
    
    // Verificar que la derivación existe
    const docSnap = await getDoc(derivacionRef);
    if (!docSnap.exists()) {
      throw new Error("Derivación no encontrada");
    }
    
    await deleteDoc(derivacionRef);
    return { message: "Derivación eliminada correctamente" };
  } catch (error) {
    throw new Error(`Error al eliminar derivación: ${error.message}`);
  }
};

// Crear un nuevo seguimiento para una derivación
export const crearSeguimiento = async (estudianteId, derivacionId, datosSeguimiento) => {
  try {
    const seguimientoData = {
      ...datosSeguimiento,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const seguimientoRef = await addDoc(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "seguimientos"), 
      seguimientoData
    );
    
    return { id: seguimientoRef.id, ...seguimientoData };
  } catch (error) {
    throw new Error(`Error al crear seguimiento: ${error.message}`);
  }
};

// Obtener todos los seguimientos de una derivación
export const obtenerSeguimientosDerivacion = async (estudianteId, derivacionId) => {
  try {
    const querySnapshot = await getDocs(
      collection(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "seguimientos")
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener seguimientos: ${error.message}`);
  }
};

// Obtener un seguimiento específico
export const obtenerSeguimientoPorId = async (estudianteId, derivacionId, seguimientoId) => {
  try {
    const seguimientoRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "seguimientos", seguimientoId);
    const docSnap = await getDoc(seguimientoRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Seguimiento no encontrado");
    }
  } catch (error) {
    throw new Error(`Error al obtener seguimiento: ${error.message}`);
  }
};

// Actualizar un seguimiento
export const actualizarSeguimiento = async (estudianteId, derivacionId, seguimientoId, datosActualizados) => {
  try {
    const seguimientoRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "seguimientos", seguimientoId);
    const docSnap = await getDoc(seguimientoRef);
    
    if (!docSnap.exists()) {
      throw new Error("Seguimiento no encontrado");
    }
    
    const datosActualizadosConFecha = {
      ...datosActualizados,
      fecha_actualizacion: new Date()
    };
    
    await updateDoc(seguimientoRef, datosActualizadosConFecha);
    return { message: "Seguimiento actualizado correctamente" };
  } catch (error) {
    throw new Error(`Error al actualizar seguimiento: ${error.message}`);
  }
};

// Eliminar un seguimiento
export const eliminarSeguimiento = async (estudianteId, derivacionId, seguimientoId) => {
  try {
    const seguimientoRef = doc(db, "estudiantes", estudianteId, "derivaciones", derivacionId, "seguimientos", seguimientoId);
    const docSnap = await getDoc(seguimientoRef);
    
    if (!docSnap.exists()) {
      throw new Error("Seguimiento no encontrado");
    }
    
    await deleteDoc(seguimientoRef);
    return { message: "Seguimiento eliminado correctamente" };
  } catch (error) {
    throw new Error(`Error al eliminar seguimiento: ${error.message}`);
  }
};

export default {
  crearEstudiante,
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  obtenerEstudiantePorRut,
  obtenerEstudiantesPorEstablecimiento,
  obtenerEstudiantesPorEstado,
  obtenerEstudiantesActivos,
  actualizarEstudiante,
  cambiarEstadoEstudiante,
  eliminarEstudiante,
  crearDerivacion,
  obtenerDerivacionesEstudiante,
  obtenerDerivacionPorId,
  actualizarDerivacion,
  eliminarDerivacion,
  cambiarEstadoDerivacion,
  obtenerDerivacionesPorEstado,
  obtenerDerivacionesRecientes,
  crearSeguimiento,
  obtenerSeguimientosDerivacion,
  obtenerSeguimientoPorId,
  actualizarSeguimiento,
  eliminarSeguimiento,
  validarEstudiante
};
