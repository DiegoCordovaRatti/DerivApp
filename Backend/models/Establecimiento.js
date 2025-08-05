import { db } from '../config/fireBaseDB.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// Validación de datos de establecimiento
const validarEstablecimiento = (establecimiento) => {
  const errores = [];
  
  if (!establecimiento.nombre || establecimiento.nombre.trim().length < 2) {
    errores.push("El nombre debe tener al menos 2 caracteres");
  }
  
  if (!establecimiento.comuna || establecimiento.comuna.trim().length === 0) {
    errores.push("La comuna es obligatoria");
  }
  
  if (!establecimiento.region || establecimiento.region.trim().length === 0) {
    errores.push("La región es obligatoria");
  }
  
  if (!Array.isArray(establecimiento.equipoPsicosocial)) {
    errores.push("El equipo psicosocial debe ser un array");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear un nuevo establecimiento
export const crearEstablecimiento = async (datosEstablecimiento) => {
  try {
    const validacion = validarEstablecimiento(datosEstablecimiento);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const establecimientoData = {
      ...datosEstablecimiento,
      equipoPsicosocial: datosEstablecimiento.equipoPsicosocial || [],
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const docRef = await addDoc(collection(db, "establecimientos"), establecimientoData);
    return { id: docRef.id, ...establecimientoData };
  } catch (error) {
    throw new Error(`Error al crear establecimiento: ${error.message}`);
  }
};

// Obtener todos los establecimientos
export const obtenerEstablecimientos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "establecimientos"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener establecimientos: ${error.message}`);
  }
};

// Obtener establecimiento por ID
export const obtenerEstablecimientoPorId = async (id) => {
  try {
    const docRef = doc(db, "establecimientos", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Establecimiento no encontrado");
    }
  } catch (error) {
    throw new Error(`Error al obtener establecimiento: ${error.message}`);
  }
};

// Obtener establecimientos por región
export const obtenerEstablecimientosPorRegion = async (region) => {
  try {
    const q = query(collection(db, "establecimientos"), where("region", "==", region));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener establecimientos por región: ${error.message}`);
  }
};

// Obtener establecimientos por comuna
export const obtenerEstablecimientosPorComuna = async (comuna) => {
  try {
    const q = query(collection(db, "establecimientos"), where("comuna", "==", comuna));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener establecimientos por comuna: ${error.message}`);
  }
};

// Actualizar establecimiento
export const actualizarEstablecimiento = async (id, datosActualizados) => {
  try {
    const docRef = doc(db, "establecimientos", id);
    
    // Validar datos si se proporcionan
    if (datosActualizados.nombre || datosActualizados.comuna || datosActualizados.region) {
      const establecimientoActual = await obtenerEstablecimientoPorId(id);
      const datosCompletos = { ...establecimientoActual, ...datosActualizados };
      const validacion = validarEstablecimiento(datosCompletos);
      
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
    throw new Error(`Error al actualizar establecimiento: ${error.message}`);
  }
};

// Agregar miembro al equipo psicosocial
export const agregarMiembroEquipo = async (id, userId) => {
  try {
    const docRef = doc(db, "establecimientos", id);
    const establecimiento = await obtenerEstablecimientoPorId(id);
    const equipoActualizado = [...establecimiento.equipoPsicosocial, userId];
    
    await updateDoc(docRef, {
      equipoPsicosocial: equipoActualizado,
      fecha_actualizacion: new Date()
    });
    
    return { message: "Miembro agregado al equipo correctamente", equipo: equipoActualizado };
  } catch (error) {
    throw new Error(`Error al agregar miembro al equipo: ${error.message}`);
  }
};

// Remover miembro del equipo psicosocial
export const removerMiembroEquipo = async (id, userId) => {
  try {
    const docRef = doc(db, "establecimientos", id);
    const establecimiento = await obtenerEstablecimientoPorId(id);
    const equipoActualizado = establecimiento.equipoPsicosocial.filter(id => id !== userId);
    
    await updateDoc(docRef, {
      equipoPsicosocial: equipoActualizado,
      fecha_actualizacion: new Date()
    });
    
    return { message: "Miembro removido del equipo correctamente", equipo: equipoActualizado };
  } catch (error) {
    throw new Error(`Error al remover miembro del equipo: ${error.message}`);
  }
};

// Eliminar establecimiento
export const eliminarEstablecimiento = async (id) => {
  try {
    const docRef = doc(db, "establecimientos", id);
    await deleteDoc(docRef);
    return { message: "Establecimiento eliminado permanentemente" };
  } catch (error) {
    throw new Error(`Error al eliminar establecimiento: ${error.message}`);
  }
};

export default {
  crearEstablecimiento,
  obtenerEstablecimientos,
  obtenerEstablecimientoPorId,
  obtenerEstablecimientosPorRegion,
  obtenerEstablecimientosPorComuna,
  actualizarEstablecimiento,
  agregarMiembroEquipo,
  removerMiembroEquipo,
  eliminarEstablecimiento,
  validarEstablecimiento
}; 