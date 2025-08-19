import { 
  crearUsuario, 
  obtenerUsuarioPorEmail, 
  obtenerUsuarioPorId, 
  actualizarUsuario,
  obtenerUsuariosPorEstablecimiento,
  obtenerUsuariosPorRol,
  // Nuevas funciones para Firebase Auth
  crearPerfilUsuario,
  obtenerPerfilUsuario,
  actualizarUltimoAcceso,
  ROLES,
  PERMISOS
} from '../models/Usuario.js';
import { firebaseAdmin } from '../config/firebaseAdmin.js';

// Registro de usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, rol, telefono, password, establecimientoId } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await obtenerUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Crear usuario
    const nuevoUsuario = await crearUsuario({
      nombre,
      email,
      rol,
      telefono,
      establecimientoId,
      password: password
    });

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Login de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario por email
    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    if (usuario.password !== password) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      message: 'Login exitoso',
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Obtener perfil del usuario
export const obtenerPerfil = async (req, res) => {
  try {
    const { userId } = req.body; // Recibimos el ID en el body
    
    if (!userId) {
      return res.status(400).json({
        error: 'ID de usuario requerido'
      });
    }

    const usuario = await obtenerUsuarioPorId(userId);

    if (!usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Actualizar perfil del usuario
export const actualizarPerfil = async (req, res) => {
  try {
    const { userId, nombre, telefono, email } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'ID de usuario requerido'
      });
    }

    // Validar campos
    if (!nombre || nombre.trim().length < 2) {
      return res.status(400).json({ 
        error: 'El nombre debe tener al menos 2 caracteres' 
      });
    }

    if (email && !email.includes('@')) {
      return res.status(400).json({ 
        error: 'El email no es válido' 
      });
    }

    // Actualizar usuario
    const datosActualizados = { nombre, telefono };
    if (email) {
      datosActualizados.email = email;
    }

    const usuarioActualizado = await actualizarUsuario(userId, datosActualizados);

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuarioActualizado;

    res.json({
      message: 'Perfil actualizado exitosamente',
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Cambiar contraseña
export const cambiarPassword = async (req, res) => {
  try {
    const { userId, passwordActual, passwordNueva } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'ID de usuario requerido'
      });
    }

    // Validar campos
    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({ 
        error: 'Contraseña actual y nueva son requeridas' 
      });
    }

    if (passwordNueva.length < 6) {
      return res.status(400).json({ 
        error: 'La nueva contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Obtener usuario actual
    const usuario = await obtenerUsuarioPorId(userId);
    if (!usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    // Verificar contraseña actual
    if (usuario.password !== passwordActual) {
      return res.status(401).json({ 
        error: 'Contraseña actual incorrecta' 
      });
    }

    // Actualizar contraseña
    await actualizarUsuario(userId, {
      password: passwordNueva
    });

    res.json({
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Verificar usuario
export const verificarUsuario = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        error: 'ID de usuario requerido'
      });
    }

    const usuario = await obtenerUsuarioPorId(userId);
    
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Remover password de la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      message: 'Usuario válido',
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error al verificar usuario:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Obtener usuarios por establecimiento
export const obtenerUsuariosPorEstablecimientoCtrl = async (req, res) => {
  try {
    const { establecimientoId } = req.params;
    
    if (!establecimientoId) {
      return res.status(400).json({
        error: 'ID del establecimiento es requerido'
      });
    }
    
    const usuarios = await obtenerUsuariosPorEstablecimiento(establecimientoId);
    
    // Remover passwords de la respuesta
    const usuariosSinPassword = usuarios.map(usuario => {
      const { password: _, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword;
    });
    
    res.json({
      usuarios: usuariosSinPassword,
      total: usuariosSinPassword.length,
      establecimientoId
    });
  } catch (error) {
    console.error('Error al obtener usuarios por establecimiento:', error);
    res.status(500).json({
      error: 'Error al obtener usuarios',
      details: error.message
    });
  }
};

// Obtener usuarios por rol
export const obtenerUsuariosPorRolCtrl = async (req, res) => {
  try {
    const { rol } = req.params;
    
    if (!['docente', 'trabajador_social', 'jefe_convivencia'].includes(rol)) {
      return res.status(400).json({
        error: 'Rol inválido. Debe ser: docente, trabajador_social o jefe_convivencia'
      });
    }
    
    const usuarios = await obtenerUsuariosPorRol(rol);
    
    // Remover passwords de la respuesta
    const usuariosSinPassword = usuarios.map(usuario => {
      const { password: _, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword;
    });
    
    res.json({
      usuarios: usuariosSinPassword,
      total: usuariosSinPassword.length,
      rol
    });
  } catch (error) {
    console.error('Error al obtener usuarios por rol:', error);
    res.status(500).json({
      error: 'Error al obtener usuarios',
      details: error.message
    });
  }
};

// ========== NUEVAS FUNCIONES FIREBASE AUTH ==========

// Crear usuario con Firebase Auth
export const crearUsuarioFirebase = async (req, res) => {
  try {
    const { email, password, nombre, apellido, rol, establecimientoId } = req.body;

    // Validar campos requeridos
    if (!email || !password || !nombre || !rol) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, nombre y rol son requeridos'
      });
    }

    // Validar rol
    if (!Object.values(ROLES).includes(rol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido',
        roles_disponibles: Object.values(ROLES)
      });
    }

    // Crear usuario en Firebase Auth
    const firebaseUser = await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName: `${nombre} ${apellido || ''}`.trim(),
      emailVerified: false
    });

    // Crear perfil en Firestore
    const perfilUsuario = await crearPerfilUsuario(firebaseUser.uid, {
      email,
      nombre,
      apellido,
      rol,
      establecimientoId
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario: {
        uid: firebaseUser.uid,
        ...perfilUsuario
      }
    });

  } catch (error) {
    console.error('Error al crear usuario Firebase:', error);
    
    // Manejo de errores específicos de Firebase
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }
    
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }
    
    if (error.code === 'auth/weak-password') {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

// Obtener perfil del usuario autenticado
export const obtenerPerfilAutenticado = async (req, res) => {
  try {
    // El usuario ya viene del middleware de autenticación
    const usuario = req.usuario;
    
    res.json({
      success: true,
      usuario: {
        id: usuario.id,
        uid: usuario.uid,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        establecimientoId: usuario.establecimientoId,
        activo: usuario.activo,
        permisos: usuario.permisos,
        ultimo_acceso: usuario.ultimo_acceso,
        fecha_creacion: usuario.fecha_creacion
      }
    });

  } catch (error) {
    console.error('Error al obtener perfil autenticado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

// Verificar token
export const verificarTokenFirebase = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token requerido'
      });
    }
    
    // Verificar token con Firebase
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    
    // Obtener perfil del usuario
    const perfil = await obtenerPerfilUsuario(decodedToken.uid);
    
    if (!perfil) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de usuario no encontrado'
      });
    }
    
    if (!perfil.activo) {
      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }
    
    res.json({
      success: true,
      usuario: perfil,
      firebase_uid: decodedToken.uid
    });
    
  } catch (error) {
    console.error('Error al verificar token:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Obtener roles y permisos disponibles
export const obtenerRolesPermisos = async (req, res) => {
  try {
    res.json({
      success: true,
      roles: ROLES,
      permisos: PERMISOS
    });
  } catch (error) {
    console.error('Error al obtener roles y permisos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener roles y permisos'
    });
  }
};

// Desactivar usuario
export const desactivarUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    // Obtener perfil actual
    const perfil = await obtenerUsuarioPorId(usuarioId);
    if (!perfil) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Desactivar en Firestore
    await actualizarUsuario(usuarioId, { activo: false });
    
    // Desactivar en Firebase Auth si tiene UID
    if (perfil.uid) {
      await firebaseAdmin.auth().updateUser(perfil.uid, { disabled: true });
    }
    
    res.json({
      success: true,
      message: 'Usuario desactivado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desactivar usuario',
      error: error.message
    });
  }
};

export default {
  // Funciones originales
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword,
  verificarUsuario,
  obtenerUsuariosPorEstablecimientoCtrl,
  obtenerUsuariosPorRolCtrl,
  // Nuevas funciones Firebase
  crearUsuarioFirebase,
  obtenerPerfilAutenticado,
  verificarTokenFirebase,
  obtenerRolesPermisos,
  desactivarUsuario
};
