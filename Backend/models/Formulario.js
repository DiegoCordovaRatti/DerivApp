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
  orderBy,
  limit
} from "firebase/firestore";

// Validación de datos de formulario
const validarFormulario = (formulario) => {
  const errores = [];
  
  if (!formulario.tipo || !['informe_intervencion', 'plan_accion'].includes(formulario.tipo)) {
    errores.push("El tipo debe ser: informe_intervencion o plan_accion");
  }
  
  if (!formulario.contenido || formulario.contenido.trim().length < 10) {
    errores.push("El contenido debe tener al menos 10 caracteres");
  }
  
  if (!formulario.creado_por || formulario.creado_por.trim().length === 0) {
    errores.push("El ID de quien crea el formulario es obligatorio");
  }
  
  if (!formulario.derivacionId || formulario.derivacionId.trim().length === 0) {
    errores.push("El ID de la derivación es obligatorio");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear un nuevo formulario
export const crearFormulario = async (datosFormulario) => {
  try {
    const validacion = validarFormulario(datosFormulario);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const formularioData = {
      ...datosFormulario,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const docRef = await addDoc(collection(db, "formularios"), formularioData);
    return { id: docRef.id, ...formularioData };
  } catch (error) {
    throw new Error(`Error al crear formulario: ${error.message}`);
  }
};

// Obtener todos los formularios
export const obtenerFormularios = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "formularios"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener formularios: ${error.message}`);
  }
};

// Obtener formulario por ID
export const obtenerFormularioPorId = async (id) => {
  try {
    const docRef = doc(db, "formularios", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Formulario no encontrado");
    }
  } catch (error) {
    throw new Error(`Error al obtener formulario: ${error.message}`);
  }
};

// Obtener formularios por derivación
export const obtenerFormulariosPorDerivacion = async (derivacionId) => {
  try {
    const q = query(collection(db, "formularios"), where("derivacionId", "==", derivacionId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener formularios de la derivación: ${error.message}`);
  }
};

// Obtener formularios por tipo
export const obtenerFormulariosPorTipo = async (tipo) => {
  try {
    const q = query(collection(db, "formularios"), where("tipo", "==", tipo));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener formularios por tipo: ${error.message}`);
  }
};

// Obtener formularios por creador
export const obtenerFormulariosPorCreador = async (creadoPor) => {
  try {
    const q = query(collection(db, "formularios"), where("creado_por", "==", creadoPor));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener formularios del creador: ${error.message}`);
  }
};

// Obtener formularios recientes
export const obtenerFormulariosRecientes = async (limite = 10) => {
  try {
    const q = query(
      collection(db, "formularios"),
      orderBy("fecha_creacion", "desc"),
      limit(limite)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener formularios recientes: ${error.message}`);
  }
};

// Actualizar formulario
export const actualizarFormulario = async (id, datosActualizados) => {
  try {
    const docRef = doc(db, "formularios", id);
    
    // Validar datos si se proporcionan
    if (datosActualizados.tipo || datosActualizados.contenido) {
      const formularioActual = await obtenerFormularioPorId(id);
      const datosCompletos = { ...formularioActual, ...datosActualizados };
      const validacion = validarFormulario(datosCompletos);
      
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
    throw new Error(`Error al actualizar formulario: ${error.message}`);
  }
};

// Eliminar formulario
export const eliminarFormulario = async (id) => {
  try {
    const docRef = doc(db, "formularios", id);
    await deleteDoc(docRef);
    return { message: "Formulario eliminado permanentemente" };
  } catch (error) {
    throw new Error(`Error al eliminar formulario: ${error.message}`);
  }
};

// Generar formulario con IA
export const generarFormularioIA = async (datosFormulario) => {
  try {
    // Aquí se integraría con un servicio de IA para generar contenido
    const contenidoGenerado = await generarContenidoIA(datosFormulario);
    
    const formularioData = {
      ...datosFormulario,
      contenido: contenidoGenerado,
      generado_por_ia: true,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const docRef = await addDoc(collection(db, "formularios"), formularioData);
    return { id: docRef.id, ...formularioData };
  } catch (error) {
    throw new Error(`Error al generar formulario con IA: ${error.message}`);
  }
};

// Función auxiliar para generar contenido con IA (placeholder)
const generarContenidoIA = async (datos) => {
  // Esta función se conectaría con un servicio de IA real
  // Por ahora retorna un contenido de ejemplo
  return `Formulario generado automáticamente basado en los datos proporcionados:
    
    Tipo: ${datos.tipo}
    Derivación ID: ${datos.derivacionId}
    
    Contenido generado automáticamente...`;
};

export default {
  crearFormulario,
  obtenerFormularios,
  obtenerFormularioPorId,
  obtenerFormulariosPorDerivacion,
  obtenerFormulariosPorTipo,
  obtenerFormulariosPorCreador,
  obtenerFormulariosRecientes,
  actualizarFormulario,
  eliminarFormulario,
  generarFormularioIA,
  validarFormulario
}; 