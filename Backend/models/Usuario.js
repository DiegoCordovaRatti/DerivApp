import db from '../config/fireBaseDB.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// Estructura del modelo Usuario
const usuarioSchema = {
  nombre: String,
  correo: String,
  rol: String,
  activo: Boolean,
  telefono: String,
  creadoEn: Date
};

// Validación básica de datos de usuario
const validarUsuario = (usuario) => {
  const errores = [];
  
  if (!usuario.nombre || usuario.nombre.trim().length < 2) {
    errores.push("El nombre debe tener al menos 2 caracteres");
  }
  
  if (!usuario.correo || !usuario.correo.includes('@')) {
    errores.push("El correo electrónico no es válido");
  }
  
  if (!usuario.rol || !['psicologo', 'administrador', 'profesor', 'estudiante'].includes(usuario.rol)) {
    errores.push("El rol debe ser: psicologo, administrador, profesor o estudiante");
  }
  
  if (typeof usuario.activo !== 'boolean') {
    errores.push("El campo activo debe ser true o false");
  }
  
  if (!usuario.telefono || usuario.telefono.length < 8) {
    errores.push("El teléfono debe tener al menos 8 dígitos");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear un nuevo usuario
export const crearUsuario = async (datosUsuario) => {
  try {
    // Validar datos
    const validacion = validarUsuario(datosUsuario);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    // Preparar datos con timestamp
    const usuarioData = {
      ...datosUsuario,
      creadoEn: new Date(),
      actualizadoEn: new Date()
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

// Obtener usuario por correo
export const obtenerUsuarioPorCorreo = async (correo) => {
  try {
    const q = query(collection(db, "usuarios"), where("correo", "==", correo));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Error al buscar usuario por correo: ${error.message}`);
  }
};

// Actualizar usuario
export const actualizarUsuario = async (id, datosActualizados) => {
  try {
    const docRef = doc(db, "usuarios", id);
    
    // Validar datos si se proporcionan
    if (datosActualizados.nombre || datosActualizados.correo || datosActualizados.rol) {
      const usuarioActual = await obtenerUsuarioPorId(id);
      const datosCompletos = { ...usuarioActual, ...datosActualizados };
      const validacion = validarUsuario(datosCompletos);
      
      if (!validacion.esValido) {
        throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
      }
    }
    
    // Agregar timestamp de actualización
    const datosConTimestamp = {
      ...datosActualizados,
      actualizadoEn: new Date()
    };
    
    await updateDoc(docRef, datosConTimestamp);
    return { id, ...datosConTimestamp };
  } catch (error) {
    throw new Error(`Error al actualizar usuario: ${error.message}`);
  }
};

// Eliminar usuario (soft delete - cambiar activo a false)
export const desactivarUsuario = async (id) => {
  try {
    const docRef = doc(db, "usuarios", id);
    await updateDoc(docRef, {
      activo: false,
      actualizadoEn: new Date()
    });
    return { message: "Usuario desactivado correctamente" };
  } catch (error) {
    throw new Error(`Error al desactivar usuario: ${error.message}`);
  }
};

// Eliminar usuario permanentemente
export const eliminarUsuario = async (id) => {
  try {
    const docRef = doc(db, "usuarios", id);
    await deleteDoc(docRef);
    return { message: "Usuario eliminado permanentemente" };
  } catch (error) {
    throw new Error(`Error al eliminar usuario: ${error.message}`);
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

// Obtener usuarios activos
export const obtenerUsuariosActivos = async () => {
  try {
    const q = query(collection(db, "usuarios"), where("activo", "==", true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error al obtener usuarios activos: ${error.message}`);
  }
};

export default {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorCorreo,
  actualizarUsuario,
  desactivarUsuario,
  eliminarUsuario,
  obtenerUsuariosPorRol,
  obtenerUsuariosActivos,
  validarUsuario
};
