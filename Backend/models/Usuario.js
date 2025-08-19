import { db } from '../config/fireBaseDB.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// Roles disponibles en el sistema
export const ROLES = {
  ADMIN: 'administrador',
  PSICOLOGO: 'psicologo',
  TRABAJADOR_SOCIAL: 'trabajador_social', 
  JEFE_CONVIVENCIA: 'jefe_convivencia',
  DOCENTE: 'docente'
};

// Permisos por rol
export const PERMISOS = {
  [ROLES.ADMIN]: {
    dashboard: true,
    expedientes: { ver: true, crear: true, editar: true, eliminar: true },
    derivaciones: { ver: true, crear: true, editar: true, eliminar: true },
    agenda: { ver: true, crear: true, editar: true, eliminar: true },
    alertas: { ver: true, crear: true, editar: true, eliminar: true },
    usuarios: { ver: true, crear: true, editar: true, eliminar: true },
    configuracion: true
  },
  [ROLES.PSICOLOGO]: {
    dashboard: true,
    expedientes: { ver: true, crear: true, editar: true, eliminar: true },
    derivaciones: { ver: true, crear: true, editar: true, eliminar: true },
    agenda: { ver: true, crear: true, editar: true, eliminar: true },
    alertas: { ver: true, crear: true, editar: true, eliminar: true },
    usuarios: { ver: false, crear: false, editar: false, eliminar: false },
    configuracion: false
  },
  [ROLES.TRABAJADOR_SOCIAL]: {
    dashboard: true,
    expedientes: { ver: true, crear: true, editar: true, eliminar: true },
    derivaciones: { ver: true, crear: true, editar: true, eliminar: true },
    agenda: { ver: true, crear: true, editar: true, eliminar: true },
    alertas: { ver: true, crear: true, editar: true, eliminar: true },
    usuarios: { ver: false, crear: false, editar: false, eliminar: false },
    configuracion: false
  },
  [ROLES.JEFE_CONVIVENCIA]: {
    dashboard: true,
    expedientes: { ver: true, crear: true, editar: true, eliminar: true },
    derivaciones: { ver: true, crear: true, editar: true, eliminar: true },
    agenda: { ver: true, crear: true, editar: true, eliminar: true },
    alertas: { ver: true, crear: true, editar: true, eliminar: true },
    usuarios: { ver: false, crear: false, editar: false, eliminar: false },
    configuracion: false
  },
  [ROLES.DOCENTE]: {
    dashboard: false,
    expedientes: { ver: true, crear: false, editar: false, eliminar: false },
    derivaciones: { ver: true, crear: true, editar: false, eliminar: false },
    agenda: { ver: false, crear: false, editar: false, eliminar: false },
    alertas: { ver: false, crear: false, editar: false, eliminar: false },
    usuarios: { ver: false, crear: false, editar: false, eliminar: false },
    configuracion: false
  }
};

// Validación de datos de usuario
const validarUsuario = (usuario) => {
  const errores = [];
  
  if (!usuario.nombre || usuario.nombre.trim().length < 2) {
    errores.push("El nombre debe tener al menos 2 caracteres");
  }
  
  if (!usuario.email || !usuario.email.includes('@')) {
    errores.push("El email no es válido");
  }
  
  if (!usuario.rol || !Object.values(ROLES).includes(usuario.rol)) {
    errores.push("El rol debe ser uno de: " + Object.values(ROLES).join(', '));
  }
  
  // El establecimientoId es opcional, pero si se proporciona debe ser válido
  if (usuario.establecimientoId && usuario.establecimientoId.trim().length === 0) {
    errores.push("El ID del establecimiento no puede estar vacío si se proporciona");
  }
  
  return {
    esValido: errores.length === 0,
    errores
  };
};

// Crear perfil de usuario en Firestore (para usar con Firebase Auth)
export const crearPerfilUsuario = async (uid, datosUsuario) => {
  try {
    const validacion = validarUsuario(datosUsuario);
    if (!validacion.esValido) {
      throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
    }
    
    const perfilData = {
      uid,
      email: datosUsuario.email,
      nombre: datosUsuario.nombre,
      apellido: datosUsuario.apellido || '',
      rol: datosUsuario.rol,
      establecimientoId: datosUsuario.establecimientoId || null,
      activo: true,
      permisos: PERMISOS[datosUsuario.rol] || PERMISOS[ROLES.DOCENTE],
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
      ultimo_acceso: null
    };
    
    const docRef = await addDoc(collection(db, "usuarios"), perfilData);
    return { id: docRef.id, ...perfilData };
  } catch (error) {
    throw new Error(`Error al crear perfil de usuario: ${error.message}`);
  }
};

// Obtener perfil de usuario por UID de Firebase
export const obtenerPerfilUsuario = async (uid) => {
  try {
    const q = query(collection(db, "usuarios"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Error al obtener perfil de usuario: ${error.message}`);
  }
};

// Actualizar último acceso
export const actualizarUltimoAcceso = async (uid) => {
  try {
    const perfil = await obtenerPerfilUsuario(uid);
    if (perfil) {
      const docRef = doc(db, "usuarios", perfil.id);
      await updateDoc(docRef, {
        ultimo_acceso: new Date(),
        fecha_actualizacion: new Date()
      });
    }
  } catch (error) {
    console.error('Error al actualizar último acceso:', error);
  }
};

// Verificar permisos de usuario
export const verificarPermiso = (usuario, seccion, accion = 'ver') => {
  if (!usuario || !usuario.permisos) return false;
  
  const permisoSeccion = usuario.permisos[seccion];
  if (typeof permisoSeccion === 'boolean') {
    return permisoSeccion;
  }
  
  if (typeof permisoSeccion === 'object') {
    return permisoSeccion[accion] || false;
  }
  
  return false;
};

// Actualizar rol de usuario
export const actualizarRolUsuario = async (usuarioId, nuevoRol) => {
  try {
    if (!Object.values(ROLES).includes(nuevoRol)) {
      throw new Error('Rol inválido');
    }
    
    const docRef = doc(db, "usuarios", usuarioId);
    await updateDoc(docRef, {
      rol: nuevoRol,
      permisos: PERMISOS[nuevoRol] || PERMISOS[ROLES.DOCENTE],
      fecha_actualizacion: new Date()
    });
    return { success: true };
  } catch (error) {
    throw new Error(`Error al actualizar rol: ${error.message}`);
  }
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
  // Funciones originales
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorEmail,
  obtenerUsuariosPorEstablecimiento,
  obtenerUsuariosPorRol,
  actualizarUsuario,
  eliminarUsuario,
  validarUsuario,
  // Nuevas funciones para Firebase Auth
  crearPerfilUsuario,
  obtenerPerfilUsuario,
  actualizarUltimoAcceso,
  verificarPermiso,
  actualizarRolUsuario,
  // Constantes
  ROLES,
  PERMISOS
};
