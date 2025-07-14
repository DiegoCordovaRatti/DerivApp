import db from '../config/fireBaseDB.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// Validación de datos de alerta
const validarAlerta = (alerta) => {
  const errores = [];
  
  if (!alerta.caseId || alerta.caseId.trim().length === 0) {
    errores.push("El ID del caso es obligatorio");
  }
  
  if (!alerta.tipo || !['baja asistencia', 'conducta', 'académico', 'social', 'familiar'].includes(alerta.tipo)) {
    errores.push("El tipo debe ser: baja asistencia, conducta, académico, social o familiar");
  }
  
  if (!alerta.descripcion || alerta.descripcion.trim().length < 5) {
    errores.push("La descripción debe tener al menos 5 caracteres");
  }
  
  if (typeof alerta.umbral !== 'number' || alerta.umbral < 0) {
    errores.push("El umbral debe ser un número mayor o igual a 0");
  }
  
  if (typeof alerta.valorActual !== 'number') {
    errores.push("El valor actual debe ser un número");
  }
  
  if (typeof alerta.resuelta !== 'boolean') {
    errores.push("El campo resuelta debe ser true o false");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear una nueva alerta
export const crearAlerta = async (datosAlerta) => {
  try {
    const validacion = validarAlerta(datosAlerta);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const alertaData = {
      ...datosAlerta,
      generadaEn: new Date(),
      resuelta: datosAlerta.resuelta || false,
      resueltaPor: datosAlerta.resueltaPor || null,
      creadoEn: new Date(),
      actualizadoEn: new Date()
    };
    
    const docRef = await addDoc(collection(db, "alertas"), alertaData);
    return { id: docRef.id, ...alertaData };
  } catch (error) {
    throw new Error(`Error al crear alerta: ${error.message}`);
  }
};

// Obtener todas las alertas
export const obtenerAlertas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "alertas"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener alertas: ${error.message}`);
  }
};

// Obtener alerta por ID
export const obtenerAlertaPorId = async (id) => {
  try {
    const docRef = doc(db, "alertas", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Alerta no encontrada");
    }
  } catch (error) {
    throw new Error(`Error al obtener alerta: ${error.message}`);
  }
};

// Obtener alertas por caso
export const obtenerAlertasPorCaso = async (caseId) => {
  try {
    const q = query(collection(db, "alertas"), where("caseId", "==", caseId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener alertas del caso: ${error.message}`);
  }
};

// Obtener alertas por tipo
export const obtenerAlertasPorTipo = async (tipo) => {
  try {
    const q = query(collection(db, "alertas"), where("tipo", "==", tipo));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener alertas por tipo: ${error.message}`);
  }
};

// Obtener alertas no resueltas
export const obtenerAlertasNoResueltas = async () => {
  try {
    const q = query(collection(db, "alertas"), where("resuelta", "==", false));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener alertas no resueltas: ${error.message}`);
  }
};

// Obtener alertas resueltas
export const obtenerAlertasResueltas = async () => {
  try {
    const q = query(collection(db, "alertas"), where("resuelta", "==", true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener alertas resueltas: ${error.message}`);
  }
};

// Actualizar alerta
export const actualizarAlerta = async (id, datosActualizados) => {
  try {
    const docRef = doc(db, "alertas", id);
    
    // Validar datos si se proporcionan
    if (datosActualizados.tipo || datosActualizados.descripcion || datosActualizados.umbral) {
      const alertaActual = await obtenerAlertaPorId(id);
      const datosCompletos = { ...alertaActual, ...datosActualizados };
      const validacion = validarAlerta(datosCompletos);
      
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
    throw new Error(`Error al actualizar alerta: ${error.message}`);
  }
};

// Resolver alerta
export const resolverAlerta = async (id, resueltaPor) => {
  try {
    const docRef = doc(db, "alertas", id);
    await updateDoc(docRef, {
      resuelta: true,
      resueltaPor: resueltaPor,
      actualizadoEn: new Date()
    });
    return { message: "Alerta resuelta correctamente" };
  } catch (error) {
    throw new Error(`Error al resolver alerta: ${error.message}`);
  }
};

// Reabrir alerta
export const reabrirAlerta = async (id) => {
  try {
    const docRef = doc(db, "alertas", id);
    await updateDoc(docRef, {
      resuelta: false,
      resueltaPor: null,
      actualizadoEn: new Date()
    });
    return { message: "Alerta reabierta correctamente" };
  } catch (error) {
    throw new Error(`Error al reabrir alerta: ${error.message}`);
  }
};

// Obtener alertas de baja asistencia
export const obtenerAlertasBajaAsistencia = async () => {
  return await obtenerAlertasPorTipo('baja asistencia');
};

// Obtener alertas de conducta
export const obtenerAlertasConducta = async () => {
  return await obtenerAlertasPorTipo('conducta');
};

// Eliminar alerta
export const eliminarAlerta = async (id) => {
  try {
    const docRef = doc(db, "alertas", id);
    await deleteDoc(docRef);
    return { message: "Alerta eliminada permanentemente" };
  } catch (error) {
    throw new Error(`Error al eliminar alerta: ${error.message}`);
  }
};

export default {
  crearAlerta,
  obtenerAlertas,
  obtenerAlertaPorId,
  obtenerAlertasPorCaso,
  obtenerAlertasPorTipo,
  obtenerAlertasNoResueltas,
  obtenerAlertasResueltas,
  actualizarAlerta,
  resolverAlerta,
  reabrirAlerta,
  obtenerAlertasBajaAsistencia,
  obtenerAlertasConducta,
  eliminarAlerta,
  validarAlerta
};
