import db from '../config/fireBaseDB.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// Validación de datos de usuario
const validarUsuario = (usuario) => {
  const errores = [];
  
  if (!usuario.nombre || usuario.nombre.trim().length < 2) {
    errores.push("El nombre debe tener al menos 2 caracteres");
  }
  
  if (!usuario.email || !usuario.email.includes('@')) {
    errores.push("El email no es válido");
  }
  
  if (!usuario.rol || !['docente', 'trabajador_social', 'jefe_convivencia'].includes(usuario.rol)) {
    errores.push("El rol debe ser: docente, trabajador_social o jefe_convivencia");
  }
  
  if (!usuario.establecimientoId || usuario.establecimientoId.trim().length === 0) {
    errores.push("El ID del establecimiento es obligatorio");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear un nuevo usuario
export const crearUsuario = async (datosUsuario) => {
  try {
    const validacion = validarUsuario(datosUsuario);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const usuarioData = {
      ...datosUsuario,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    };
    
    const docRef = await addDoc(collection(db, "usuarios"), usuarioData);
    return { id: docRef.id, ...usuarioData };
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener usuarios: ${error.message}`);
  }
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (id) => {
  try {
    const docRef = doc(db, "usuarios", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    throw new Error(`Error al obtener usuario: ${error.message}`);
  }
};

// Obtener usuario por email
export const obtenerUsuarioPorEmail = async (email) => {
  try {
    const q = query(collection(db, "usuarios"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Error al buscar usuario por email: ${error.message}`);
  }
};

// Obtener usuarios por establecimiento
export const obtenerUsuariosPorEstablecimiento = async (establecimientoId) => {
  try {
    const q = query(collection(db, "usuarios"), where("establecimientoId", "==", establecimientoId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener usuarios por establecimiento: ${error.message}`);
  }
};

// Obtener usuarios por rol
export const obtenerUsuariosPorRol = async (rol) => {
  try {
    const q = query(collection(db, "usuarios"), where("rol", "==", rol));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener usuarios por rol: ${error.message}`);
  }
};

// Actualizar usuario
export const actualizarUsuario = async (id, datosActualizados) => {
  try {
    const docRef = doc(db, "usuarios", id);
    
    // Validar datos si se proporcionan
    if (datosActualizados.nombre || datosActualizados.email || datosActualizados.rol) {
      const usuarioActual = await obtenerUsuarioPorId(id);
      const datosCompletos = { ...usuarioActual, ...datosActualizados };
      const validacion = validarUsuario(datosCompletos);
      
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
    throw new Error(`Error al actualizar usuario: ${error.message}`);
  }
};

// Eliminar usuario
export const eliminarUsuario = async (id) => {
  try {
    const docRef = doc(db, "usuarios", id);
    await deleteDoc(docRef);
    return { message: "Usuario eliminado permanentemente" };
  } catch (error) {
    throw new Error(`Error al eliminar usuario: ${error.message}`);
  }
};

export default {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorEmail,
  obtenerUsuariosPorEstablecimiento,
  obtenerUsuariosPorRol,
  actualizarUsuario,
  eliminarUsuario,
  validarUsuario
};
