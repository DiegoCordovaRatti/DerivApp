import { firebaseAdmin } from '../config/firebaseAdmin.js';
import { obtenerPerfilUsuario, actualizarUltimoAcceso, verificarPermiso } from '../models/Usuario.js';

// Middleware para verificar token de Firebase
export const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar token con Firebase Admin
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    
    // Obtener perfil de usuario desde Firestore
    const perfilUsuario = await obtenerPerfilUsuario(decodedToken.uid);
    
    if (!perfilUsuario) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de usuario no encontrado'
      });
    }
    
    if (!perfilUsuario.activo) {
      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }
    
    // Actualizar último acceso (sin esperar)
    actualizarUltimoAcceso(decodedToken.uid).catch(console.error);
    
    // Agregar usuario al request
    req.usuario = {
      ...perfilUsuario,
      firebaseUid: decodedToken.uid
    };
    
    next();
  } catch (error) {
    console.error('Error en verificarToken:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        message: 'Token revocado'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware para verificar permisos específicos
export const verificarPermisos = (seccion, accion = 'ver') => {
  return (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }
      
      const tienePermiso = verificarPermiso(req.usuario, seccion, accion);
      
      if (!tienePermiso) {
        return res.status(403).json({
          success: false,
          message: `No tienes permisos para ${accion} en ${seccion}`,
          permisos_requeridos: { seccion, accion }
        });
      }
      
      next();
    } catch (error) {
      console.error('Error en verificarPermisos:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar permisos'
      });
    }
  };
};

// Middleware para verificar roles específicos
export const verificarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }
      
      if (!rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes el rol necesario para esta acción',
          rol_actual: req.usuario.rol,
          roles_permitidos: rolesPermitidos
        });
      }
      
      next();
    } catch (error) {
      console.error('Error en verificarRoles:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar roles'
      });
    }
  };
};

// Middleware opcional - no bloquea si no hay token
export const verificarTokenOpcional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.usuario = null;
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const perfilUsuario = await obtenerPerfilUsuario(decodedToken.uid);
    
    if (perfilUsuario && perfilUsuario.activo) {
      req.usuario = {
        ...perfilUsuario,
        firebaseUid: decodedToken.uid
      };
      
      // Actualizar último acceso (sin esperar)
      actualizarUltimoAcceso(decodedToken.uid).catch(console.error);
    } else {
      req.usuario = null;
    }
    
    next();
  } catch (error) {
    // En caso de error, continuar sin usuario
    req.usuario = null;
    next();
  }
};

export default {
  verificarToken,
  verificarPermisos,
  verificarRoles,
  verificarTokenOpcional
};
