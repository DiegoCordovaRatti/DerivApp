import express from 'express';
import {
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
} from '../controllers/authController.js';
import { verificarToken, verificarPermisos, verificarRoles } from '../middleware/auth.js';

const router = express.Router();

// ===== RUTAS DE AUTENTICACIÓN =====

// Rutas básicas de autenticación
router.post('/registrar', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/perfil', obtenerPerfil);
router.put('/perfil', actualizarPerfil);
router.put('/cambiar-password', cambiarPassword);
router.post('/verificar', verificarUsuario);

// ===== RUTAS FIREBASE AUTHENTICATION =====

// Rutas públicas (sin autenticación)
router.post('/firebase/verificar-token', verificarTokenFirebase);
router.get('/roles-permisos', obtenerRolesPermisos);

// Rutas protegidas (requieren autenticación)
router.get('/perfil-autenticado', verificarToken, obtenerPerfilAutenticado);

// Rutas administrativas (solo admin)
router.post('/firebase/crear-usuario', 
  verificarToken, 
  verificarRoles('administrador'), 
  crearUsuarioFirebase
);

router.patch('/desactivar/:usuarioId', 
  verificarToken, 
  verificarRoles('administrador'), 
  desactivarUsuario
);

// ===== RUTAS DE USUARIOS =====

// Rutas de consulta de usuarios
router.get('/establecimiento/:establecimientoId', 
  verificarToken,
  verificarPermisos('usuarios', 'ver'),
  obtenerUsuariosPorEstablecimientoCtrl
);

router.get('/rol/:rol', 
  verificarToken,
  verificarPermisos('usuarios', 'ver'),
  obtenerUsuariosPorRolCtrl
);

export default router;
