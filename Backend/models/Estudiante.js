import db from '../config/fireBaseDB.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

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
  
  if (!estudiante.estado || !['activo', 'inactivo', 'egresado'].includes(estudiante.estado)) {
    errores.push("El estado debe ser: activo, inactivo o egresado");
  }
  
  if (!estudiante.fechaIngreso) {
    errores.push("La fecha de ingreso es obligatoria");
  }
  
  if (!estudiante.contactoApoderado || !estudiante.contactoApoderado.nombre) {
    errores.push("El contacto del apoderado es obligatorio");
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
      fechaIngreso: new Date(datosEstudiante.fechaIngreso),
      fechaEgreso: datosEstudiante.fechaEgreso ? new Date(datosEstudiante.fechaEgreso) : null,
      notas: datosEstudiante.notas || [],
      creadoEn: new Date(),
      actualizadoEn: new Date()
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
      actualizadoEn: new Date()
    };
    
    await updateDoc(docRef, datosConTimestamp);
    return { id, ...datosConTimestamp };
  } catch (error) {
    throw new Error(`Error al actualizar estudiante: ${error.message}`);
  }
};

// Agregar nota a estudiante
export const agregarNotaEstudiante = async (id, nota) => {
  try {
    const docRef = doc(db, "estudiantes", id);
    const estudiante = await obtenerEstudiantePorId(id);
    const notasActualizadas = [...estudiante.notas, nota];
    
    await updateDoc(docRef, {
      notas: notasActualizadas,
      actualizadoEn: new Date()
    });
    
    return { message: "Nota agregada correctamente", notas: notasActualizadas };
  } catch (error) {
    throw new Error(`Error al agregar nota: ${error.message}`);
  }
};

// Cambiar estado de estudiante
export const cambiarEstadoEstudiante = async (id, nuevoEstado, fechaEgreso = null) => {
  try {
    const docRef = doc(db, "estudiantes", id);
    const datosActualizados = {
      estado: nuevoEstado,
      actualizadoEn: new Date()
    };
    
    if (nuevoEstado === 'egresado' && fechaEgreso) {
      datosActualizados.fechaEgreso = new Date(fechaEgreso);
    }
    
    await updateDoc(docRef, datosActualizados);
    return { message: `Estudiante ${nuevoEstado} correctamente` };
  } catch (error) {
    throw new Error(`Error al cambiar estado: ${error.message}`);
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
  return await obtenerEstudiantesPorEstado('activo');
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

export default {
  crearEstudiante,
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  obtenerEstudiantePorRut,
  actualizarEstudiante,
  agregarNotaEstudiante,
  cambiarEstadoEstudiante,
  obtenerEstudiantesPorEstado,
  obtenerEstudiantesActivos,
  eliminarEstudiante,
  validarEstudiante
};
